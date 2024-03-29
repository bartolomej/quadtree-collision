import {BaseApp} from "./base-app.js";
import {Circle} from "./circle.js";
import {Vector} from "./vector.js";
import {QuadTree} from "./quadtree.js";
import {Object2D} from "./2d-object.js"
import {Rectangle} from "./rectangle.js";
import {BruteforceCollisionDetection, QuadtreeCollisionDetection} from "./collision.js";
import * as TweakPane from "./tweakpane.min.js"


const collisionDetectionStrategies = {
    BRUTE_FORCE: "BRUTE_FORCE",
    QUAD_TREE: "QUAD_TREE"
}

const colors = {
    ORANGE: '#ff7f00',
    GRAY: '#484848FF'
}

/**
 * This codebase is purposely a bit over-engineered (e.g. with usage of interfaces),
 * but I wanted to build a flexible system that wouldn't be limited to just circle shapes.
 * + I also just wanted to try out JSDoc types a bit :)
 * Although I then ran out of time and didn't get a chance to fully realise that.
 */
class App extends BaseApp {

    start() {
        /**
         * @type {Object2D[]}
         */
        this.objects = [];
        this.mouseDownPosition = null;
        this.objectCreationInterval = null;
        this.drawTree = true;
        this.collisionDetectionStrategy = collisionDetectionStrategies.QUAD_TREE;
        this.quadTree = new QuadTree(this.rootBounds, 50, 5);
        this.collisionDetectionStrategies = new Map([
            [collisionDetectionStrategies.QUAD_TREE, new QuadtreeCollisionDetection(this.quadTree)],
            [collisionDetectionStrategies.BRUTE_FORCE, new BruteforceCollisionDetection()],
        ])
        this.canvas.addEventListener('mousedown', this._onMouseDown.bind(this));
        this.canvas.addEventListener('mouseup', this._onMouseUp.bind(this));
        this.canvas.addEventListener('mousemove', this._onMouseMove.bind(this));

        this.params = new AppParams(this);
        this.params.initUi();

        this.initShapes(20);
    }

    get rootBounds() {
        const {canvas} = this;
        return new Rectangle(...[
            0,
            0,
            canvas.width,
            canvas.height
        ])
    }

    initShapes(numberOfShapes) {
        this.objects = [];
        for (let i = 0; i < numberOfShapes; i++) {
            const {width, height} = this.canvas;
            const randomPosition = new Vector(Math.random() * width, Math.random() * height);
            this.addRandomObject(randomPosition);
        }
    }

    addRandomObject(position) {
        const randomDirection = () => Math.random() > 0.5 ? -1 : 1;
        const velocity = new Vector(
            Math.random() * this.params.objectVelocityFactor * randomDirection(),
            Math.random() * this.params.objectVelocityFactor * randomDirection()
        );
        this.objects.push(new Circle(
            position,
            velocity,
            Math.random() * this.params.objectSizeFactor,
            colors.GRAY
        ));
    }

    _onMouseDown(e) {
        this.mouseDownPosition = new Vector(e.clientX, e.clientY);
        this.addRandomObject(this.mouseDownPosition);
        this.objectCreationInterval = setInterval(() => this.addRandomObject(this.mouseDownPosition), 50)
    }

    _onMouseMove(e) {
        // update only if mouse is in pressed state
        if (this.mouseDownPosition) {
            this.mouseDownPosition = new Vector(e.clientX, e.clientY);
        }
    }

    _onMouseUp() {
        this.mouseDownPosition = null;
        clearInterval(this.objectCreationInterval);
    }

    resize() {
        if (this.quadTree) {
            this.quadTree.destroy();
            this.quadTree.bounds = this.rootBounds;
        }
    }

    update() {
        const {canvas} = this.ctx;

        for (const object of this.objects) {
            if (!(object instanceof Circle)) {
                throw new Error("Circle is the only supported shape")
            }
            // More flexible way to perform this collision check (e.g. when using multiple shapes),
            // would be by defining borders as rectangles using `Rectangle` class
            // and then using `Rectangle.collidesWith(object)` (assuming it implements Object2D interface)
            // to perform the collision check for any object type.
            if (object.position.x + object.radius >= canvas.width || object.position.x - object.radius <= 0) {
                object.velocity = object.velocity.mul(new Vector(-1, 1))
            }
            if (object.position.y + object.radius >= canvas.height || object.position.y - object.radius <= 0) {
                object.velocity = object.velocity.mul(new Vector(1, -1))
            }
            object.position = object.position.add(object.velocity);

            // Clamp positions to stay within bounds (otherwise quadtree collision detection may fail)
            object.position.x = Math.max(object.radius, Math.min(object.position.x, canvas.width - object.radius));
            object.position.y = Math.max(object.radius, Math.min(object.position.y, canvas.height - object.radius));

            // Reset the color to the default one
            object.color = colors.GRAY;
        }

        const t0 = performance.now();
        const collidingPairs = this.collisionDetectionStrategies.get(this.collisionDetectionStrategy).getCollidingPairs(this.objects);
        const t1 = performance.now();
        this.params.runtime = t1 - t0;

        for (const collidingPair of collidingPairs) {
            collidingPair[0].color = colors.ORANGE;
            collidingPair[1].color = colors.ORANGE;
        }
    }

    render() {
        const {ctx, quadTree, drawTree} = this;
        super.render();
        if (drawTree) {
            quadTree.render(ctx);
        }
        this.objects.forEach(object => object.render(ctx))
    }
}

/**
 * This class uses a helper library (TweakPane) to easily
 * display the UI for controlling and displaying parameters.
 * I hope this doesn't count as using external libraries,
 * since I didn't use any libraries for the core logic.
 */
class AppParams {

    /**
     * @param app {App}
     */
    constructor(app) {
        this.app = app;
        this.objectVelocityFactor = 2;
        this.objectSizeFactor = 30;
        this.runtime = 0;
    }

    initUi() {
        this.tweakPane = new TweakPane.Pane();
        const generalFolder = this.tweakPane.addFolder({
            title: "General"
        });
        generalFolder.addBinding(this, 'collisionDetectionStrategy', {
            label: "algorithm",
            options: {
                'Brute force': collisionDetectionStrategies.BRUTE_FORCE,
                'Quad tree': collisionDetectionStrategies.QUAD_TREE
            }
        });
        generalFolder.addBinding(this, 'numberOfObjects', {
            label: "object count",
            step: 1,
            min: 1,
            max: 1500
        });
        generalFolder.addBinding(this, 'objectSizeFactor', {
            label: "object size factor",
            step: 1,
            min: 1,
            max: 50
        });
        generalFolder.addBinding(this, 'objectVelocityFactor', {
            label: "object velocity factor",
            step: 1,
            min: 1,
            max: 10
        });

        const quadTreeFolder = this.tweakPane.addFolder({
            title: "Quad tree"
        });
        quadTreeFolder.addBinding(this, 'maxCapacity', {
            label: "max capacity",
            step: 1,
            min: 1,
            max: 100
        });
        quadTreeFolder.addBinding(this, 'maxDepth', {
            label: "max depth",
            step: 1,
            min: 1,
            max: 100
        });
        quadTreeFolder.addBinding(this, 'drawTree', {
            label: "draw tree"
        });

        const perfFolder = this.tweakPane.addFolder({
            title: "Performance"
        })
        perfFolder.addBinding(this, 'numberOfObjects', {
            readonly: true,
            label: "objects count",
            view: 'graph',
            min: 1,
            max: 1500
        });
        perfFolder.addBinding(this, 'runtime', {
            readonly: true,
            label: "runtime (ms)",
            view: 'graph',
            min: 1,
            max: 200
        });
    }

    refreshUi() {
        this.tweakPane.refresh();
    }

    set numberOfObjects(x) {
        if (x !== this.app.objects.length) {
            this.app.initShapes(x);
        }
    }

    get numberOfObjects() {
        return this.app.objects.length;
    }

    set collisionDetectionStrategy(x) {
        this.app.quadTree.destroy();
        this.app.collisionDetectionStrategy = x;
    }

    get collisionDetectionStrategy() {
        return this.app.collisionDetectionStrategy;
    }

    set maxCapacity(x) {
        this.app.quadTree.maxCapacity = x;
    }

    get maxCapacity() {
        return this.app.quadTree.maxCapacity;
    }

    set maxDepth(x) {
        this.app.quadTree.maxDepth = x;
    }

    get maxDepth() {
        return this.app.quadTree.maxDepth;
    }

    set drawTree(x) {
        this.app.drawTree = x;
    }

    get drawTree() {
        return this.app.drawTree;
    }

}

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.querySelector('canvas');
    window.app = new App(canvas);
})

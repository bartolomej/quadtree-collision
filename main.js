import {BaseApp} from "./base-app.js";
import {Circle} from "./circle.js";
import Vector from "./vector.js";
import {QuadTree} from "./quadtree.js";
import Rectangle from "./rectangle.js";
import {BruteforceCollisionDetection, QuadtreeCollisionDetection} from "./collision.js";


const collisionDetectionStrategies = {
    BRUTE_FORCE: "BRUTE_FORCE",
    QUAD_TREE: "QUAD_TREE"
}

const colors = {
    ORANGE: '#ff7f00',
    GRAY: '#484848FF'
}

class App extends BaseApp {

  start () {
    this.shapes = [];
    this.mouseDownPosition = null;
    this.drawTree = true;
    this.collisionDetectionStrategy = collisionDetectionStrategies.QUAD_TREE;
    this.quadTree = new QuadTree(this.rootBounds, 100, 1);
    this.collisionDetectionStrategies = new Map([
        [collisionDetectionStrategies.QUAD_TREE, new QuadtreeCollisionDetection(this.quadTree)],
        [collisionDetectionStrategies.BRUTE_FORCE, new BruteforceCollisionDetection()],
    ])
    this._initCircles(5);
    this.runtime = 0; // runtime of collision detection algorithm
    this.canvas.addEventListener('mousedown', this._onMouseDown.bind(this));
    this.canvas.addEventListener('mouseup', this._onMouseUp.bind(this));
    this.canvas.addEventListener('mousemove', this._onMouseMove.bind(this));

    this.params = new AppParams(this);
    this.params.initUi();
  }

  get rootBounds () {
    const { canvas } = this;
    return new Rectangle(...[
      0,
      0,
      canvas.width,
      canvas.height
    ])
  }

  _initCircles (n) {
    this.circles = [];
    for (let i = 0; i < n; i++) {
      const { width, height } = this.canvas;
      const position = new Vector(Math.random() * width, Math.random() * height);
      this._addCircle(position);
    }
  }

  _addCircle (position) {
    const vFactor = 2 * (Math.random() > 0.5 ? -1 : 1);
    const rFactor = 10;
    const radius = (Math.random() + 1) * rFactor;
    const velocity = new Vector(Math.random() * vFactor, Math.random() * vFactor);
    this.shapes.push(new Circle(position, velocity, radius, colors.GRAY))
  }

  _onMouseDown (e) {
    this.mouseDownPosition = new Vector(e.clientX, e.clientY);
  }

  _onMouseMove (e) {
    // update only if mouse is in pressed state
    if (this.mouseDownPosition) {
      this.mouseDownPosition = new Vector(e.clientX, e.clientY);
    }
  }

  _onMouseUp () {
    this.mouseDownPosition = null;
  }

  resize () {
    // update quad tree bounds, as the canvas dimensions changed
    this.quadTree = new QuadTree(this.rootBounds);
  }

  update () {
    if (this.mouseDownPosition) {
      this._addCircle(this.mouseDownPosition);
      this.params.refreshUi();
    }
    const {canvas} = this.ctx;

    for (const shape of this.shapes) {
        if (shape.position.x >= canvas.width || shape.position.x <= 0) {
            shape.velocity = shape.velocity.mul(new Vector(-1, 1))
        }
        if (shape.position.y >= canvas.height || shape.position.y <= 0) {
            shape.velocity = shape.velocity.mul(new Vector(1, -1))
        }
        shape.position = shape.position.add(shape.velocity);

        // Reset the color to the default one
        shape.color = colors.GRAY;
    }

    // TODO: Check for collisions

    const collidingPairs = this.collisionDetectionStrategies.get(this.collisionDetectionStrategy).getCollidingPairs(this.shapes);

    for (const collidingPair of collidingPairs) {
        collidingPair[0].color = colors.ORANGE;
        collidingPair[1].color = colors.ORANGE;
    }
  }

  render () {
    const { ctx, quadTree, drawTree } = this;
    super.render();
    if (drawTree) {
      quadTree.render(ctx);
    }
    this.shapes.forEach(shape => shape.render(ctx))
  }
}

class AppParams {

    /**
     * @param app {App}
     */
    constructor (app) {
        this.app = app;
    }

    initUi() {
        this.tweakPane = new Tweakpane.Pane();
        const paramsFolder = this.tweakPane.addFolder({
            title: "Parameters"
        })
        const graphsFolder = this.tweakPane.addFolder({
            title: "Graphs"
        })
        paramsFolder.addInput(this, 'collisionDetectionStrategy', {
            options: {
                'Brute force': collisionDetectionStrategies.BRUTE_FORCE,
                'Quad tree': collisionDetectionStrategies.QUAD_TREE
            }
        });
        paramsFolder.addInput(this, 'nCircles', {
            step: 1,
            min: 1,
            max: 1500
        });
        paramsFolder.addInput(this, 'maxCapacity', {
            step: 1,
            min: 1,
            max: 100
        });
        paramsFolder.addInput(this, 'maxDepth', {
            step: 1,
            min: 1,
            max: 100
        });
        paramsFolder.addInput(this, 'drawTree');

        graphsFolder.addMonitor(this, 'nCircles', {
            view: 'graph',
            min: 1,
            max: 1500
        });
        graphsFolder.addMonitor(this, 'runtime', {
            view: 'graph',
            min: 1,
            max: 300
        });
    }

    refreshUi() {
        this.tweakPane.refresh();
    }

    set nCircles (x) {
        if (x !== this.app.shapes.length) {
            this.app._initCircles(x);
        }
    }

    get nCircles () {
        return this.app.shapes.length;
    }

    set collisionDetectionStrategy (x) {
        this.app.quadTree.destroy();
        this.app.collisionDetectionStrategy = x;
    }

    get collisionDetectionStrategy () {
        return this.app.collisionDetectionStrategy;
    }

    set maxCapacity (x) {
        this.app.quadTree.maxCapacity = x;
    }

    get maxCapacity () {
        return this.app.quadTree.maxCapacity;
    }

    set maxDepth (x) {
        this.app.quadTree.maxDepth = x;
    }

    get maxDepth () {
        return this.app.quadTree.maxDepth;
    }

    set runtime (x) {
        this.app.runtime = x;
    }

    get runtime () {
        return this.app.runtime;
    }

    set drawTree (x) {
        this.app.drawTree = x;
    }

    get drawTree () {
        return this.app.drawTree;
    }

}

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.querySelector('canvas');
  window.app = new App(canvas);

})

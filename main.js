import AbstractApp from "./app.js";
import {Circle} from "./circle.js";
import Vector from "./vector.js";
import {QuadTree} from "./quadtree.js";
import Rectangle from "./rectangle.js";
import {BruteforceCollisionDetection, QuadtreeCollisionDetection} from "./collision-detection.js";


const collisionDetectionStrategies = {
    BRUTE_FORCE: "BRUTE_FORCE",
    QUAD_TREE: "QUAD_TREE"
}

const colors = {
    ORANGE: '#ff7f00',
    GRAY: '#484848FF'
}

class App extends AbstractApp {

  start () {
    this.collisionDetectionStrategies = new Map([
        [collisionDetectionStrategies.QUAD_TREE, new QuadtreeCollisionDetection()],
        [collisionDetectionStrategies.BRUTE_FORCE, new BruteforceCollisionDetection()],
    ])
    this.shapes = [];
    this.mouseDownPosition = null;
    this.drawTree = true;
    this.collisionDetectionStrategy = collisionDetectionStrategies.QUAD_TREE;
    this.quadTree = new QuadTree(this.rootBounds);
    this._initCircles();
    this.runtime = 0; // runtime of collision detection algorithm
    this.canvas.addEventListener('mousedown', this._onMouseDown.bind(this));
    this.canvas.addEventListener('mouseup', this._onMouseUp.bind(this));
    this.canvas.addEventListener('mousemove', this._onMouseMove.bind(this));

    this.params = new AppParams(this);
    this.params.nCircles = 5;
    this.params.collisionDetectionStrategy = collisionDetectionStrategies.QUAD_TREE;
    this.params.maxNodeCapacity = 1;
    this.params.maxTreeDepth = 100;
    this.params.runtime = 0;
    this.params.drawTree = true;
    this.initTweakPane();
  }

  initTweakPane () {
    this.pane = new Tweakpane.Pane();
    const paramsFolder = this.pane.addFolder({
      title: "Parameters"
    })
    const graphsFolder = this.pane.addFolder({
      title: "Graphs"
    })
    paramsFolder.addInput(this.params, 'collisionDetectionStrategy', {
      options: {
        'Brute force': collisionDetectionStrategies.BRUTE_FORCE,
        'Quad tree': collisionDetectionStrategies.QUAD_TREE
      }
    });
    paramsFolder.addInput(this.params, 'nCircles', {
      step: 1,
      min: 1,
      max: 1500
    });
    paramsFolder.addInput(this.params, 'maxNodeCapacity', {
      step: 1,
      min: 1,
      max: 100
    });
    paramsFolder.addInput(this.params, 'maxTreeDepth', {
      step: 1,
      min: 1,
      max: 100
    });
    paramsFolder.addInput(this.params, 'drawTree');

    graphsFolder.addMonitor(this.params, 'nCircles', {
      view: 'graph',
      min: 1,
      max: 1500
    });
    graphsFolder.addMonitor(this.params, 'runtime', {
      view: 'graph',
      min: 1,
      max: 300
    });
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

  _initCircles (n = 5) {
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
      this.pane.refresh();
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
        collidingPair[0].color = colors.GRAY;
        collidingPair[1].color = colors.GRAY;
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

    set nCircles (x) {
        if (x !== this.app.shapes?.length) {
            this.app._initCircles(x);
        }
    }

    get nCircles () {
        return this.app.shapes.length;
    }

    set collisionDetectionStrategy (x) {
        this.app.quadTree.clear();
        this.app.collisionDetectionStrategy = x;
    }

    get collisionDetectionStrategy () {
        return this.app.collisionDetectionStrategy;
    }

    set maxNodeCapacity (x) {
        this.app.quadTree.maxNodeCapacity = x;
    }

    get maxNodeCapacity () {
        return this.app.quadTree.maxNodeCapacity;
    }

    set maxTreeDepth (x) {
        this.app.quadTree.maxTreeDepth = x;
    }

    get maxTreeDepth () {
        return this.app.quadTree.maxTreeDepth;
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

import AbstractApp from "./app.js";
import Circle from "./circle.js";
import Vector from "./vector.js";
import QuadTree from "./quadtree.js";
import Rectangle from "./rectangle.js";


const ALGORITHM = {
  BRUTE_FORCE: 'brute_force',
  QUAD_TREE: 'quad_tree'
}

class App extends AbstractApp {

  start () {
    this._initParams();
    this._initPane();
    this.circles = [];
    this.mouseDownPosition = null;
    this.algorithm = ALGORITHM.QUAD_TREE;
    this.quadTree = new QuadTree(this._getBounds());
    this._initCircles();
    this.runtime = 0; // runtime of collision detection algorithm
    this.canvas.addEventListener('mousedown', this._onMouseDown.bind(this));
    this.canvas.addEventListener('mouseup', this._onMouseUp.bind(this));
    this.canvas.addEventListener('mousemove', this._onMouseMove.bind(this));
  }

  _initParams () {
    class Params {
      constructor (app) {
        this.app = app;
      }

      set nCircles (x) {
        this.app._initCircles(x);
      }

      get nCircles () {
        return this.app.circles.length;
      }

      set algorithm (x) {
        this.app.algorithm = x;
      }

      get algorithm () {
        return this.app.algorithm;
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

    }

    this.params = new Params(this);
    this.params.nCircles = 5;
    this.params.algorithm = ALGORITHM.QUAD_TREE;
    this.params.maxNodeCapacity = 1;
    this.params.maxTreeDepth = 100;
    this.params.runtime = 0;
  }

  _initPane () {
    this.pane = new Tweakpane.Pane();
    const paramsFolder = this.pane.addFolder({
      title: "Parameters"
    })
    const graphsFolder = this.pane.addFolder({
      title: "Graphs"
    })
    paramsFolder.addInput(this.params, 'algorithm', {
      options: {
        'Brute force': ALGORITHM.BRUTE_FORCE,
        'Quad tree': ALGORITHM.QUAD_TREE
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

  _getBounds () {
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
    this.circles.push(new Circle(position, velocity, radius))
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

  _bruteForceCollisionDetection () {
    const { circles } = this;
    const t0 = performance.now();
    circles.forEach((a) => {
      circles.forEach((b) => {
        if (a.intersectsCircle(b)) {
          a.collision = true;
          b.collision = true;
        }
      })
    });
    const t1 = performance.now();
    this.runtime = t1 - t0;
  }

  _quadTreeCollisionDetection () {
    const { circles, quadTree } = this;
    const t0 = performance.now();
    quadTree.clear();
    quadTree.insertAll(circles);
    circles.forEach(circle => {
      const candidates = quadTree.retrieve(circle);
      candidates.forEach(candidate => {
        if (candidate.intersectsCircle(circle)) {
          circle.collision = true;
          candidate.collision = true;
        }
      })
    })
    const t1 = performance.now();
    this.runtime = t1 - t0;
  }

  resize () {
    // update quad tree bounds, as the canvas dimensions changed
    this.quadTree = new QuadTree(this._getBounds());
  }

  update () {
    if (this.mouseDownPosition) {
      this._addCircle(this.mouseDownPosition);
    }
    this.circles.forEach(circle => circle.update(this.ctx));

    // check for collisions
    switch (this.algorithm) {
      case ALGORITHM.BRUTE_FORCE: {
        return this._bruteForceCollisionDetection();
      }
      case ALGORITHM.QUAD_TREE: {
        return this._quadTreeCollisionDetection();
      }
    }
  }

  render () {
    const { ctx, circles, quadTree } = this;
    super.render();
    quadTree.render(ctx);
    circles.forEach(circle => circle.render(ctx))
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.querySelector('canvas');
  window.app = new App(canvas);

})

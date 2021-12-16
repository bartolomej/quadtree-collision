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
    this.circles = [];
    this.mouseDownPosition = null;
    this.algorithm = ALGORITHM.BRUTE_FORCE;
    this.quadTree = new QuadTree(this._getBounds());
    this._initCircles();
    this.canvas.addEventListener('mousedown', this._onMouseDown.bind(this));
    this.canvas.addEventListener('mouseup', this._onMouseUp.bind(this));
    this.canvas.addEventListener('mousemove', this._onMouseMove.bind(this));
  }

  _getBounds() {
    const {canvas} = this;
    return new Rectangle(...[
      0,
      0,
      canvas.width,
      canvas.height
    ])
  }

  _initCircles(n = 5) {
    for (let i = 0; i < n; i++) {
      const {width, height} = this.canvas;
      const position = new Vector(Math.random() * width, Math.random() * height);
      this._addCircle(position);
    }
  }

  _addCircle(position) {
    const vFactor = 2 * (Math.random() > 0.5 ? -1 : 1);
    const rFactor = 10;
    const radius = (Math.random() + 1) * rFactor;
    const velocity = new Vector(Math.random() * vFactor, Math.random() * vFactor);
    this.circles.push(new Circle(position, velocity, radius))
  }

  _onMouseDown(e) {
    this.mouseDownPosition = new Vector(e.clientX, e.clientY);
  }

  _onMouseMove(e) {
    // update only if mouse is in pressed state
    if (this.mouseDownPosition) {
      this.mouseDownPosition = new Vector(e.clientX, e.clientY);
    }
  }

  _onMouseUp() {
    this.mouseDownPosition = null;
  }

  _bruteForceCollisionDetection() {
    const {circles} = this;
    circles.forEach((a) => {
      circles.forEach((b) => {
        if (a.isColliding(b)) {
          a.collision = true;
          b.collision = true;
        }
      })
    })
  }

  _quadTreeCollisionDetection() {
    const {circles, quadTree} = this;
    quadTree.clear();
    quadTree.insertAll(circles);
    circles.forEach(circle => {
      const candidates = quadTree.retrieve(circle);
      candidates.forEach(candidate => {
        if (candidate.isColliding(circle)) {
          circle.collision = true;
          candidate.collision = true;
        }
      })
    })
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
    const {ctx, circles, quadTree} = this;
    super.render();
    quadTree.render(ctx);
    circles.forEach(circle => circle.render(ctx))
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.querySelector('canvas');
  window.app = new App(canvas);

})

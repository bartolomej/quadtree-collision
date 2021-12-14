import AbstractApp from "./app.js";
import Circle from "./circle.js";
import Vector from "./vector.js";


class App extends AbstractApp {

  start () {
    this.circles = [];
    this.mouseDownPosition = null;

    this._initCircles();
    this.canvas.addEventListener('mousedown', this._onMouseDown.bind(this));
    this.canvas.addEventListener('mouseup', this._onMouseUp.bind(this));
    this.canvas.addEventListener('mousemove', this._onMouseMove.bind(this));
  }

  _initCircles(n = 10) {
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

  update () {
    if (this.mouseDownPosition) {
      this._addCircle(this.mouseDownPosition);
      console.log(this.circles.length)
    }
    this.circles.forEach(circle => circle.update(this.ctx))
  }

  render () {
    const {ctx} = this;
    super.render();
    this.circles.forEach(circle => circle.draw(ctx))
    ctx.stroke();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.querySelector('canvas');
  window.app = new App(canvas);

})

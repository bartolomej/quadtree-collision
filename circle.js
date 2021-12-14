import Vector from "./vector.js";


export default class Circle {

  constructor (position = new Vector(0, 0), velocity = new Vector(1, 1), radius = 5) {
    this.position = position;
    this.velocity = velocity;
    this.radius = radius;
  }

  distanceTo(circle) {
    return this.position.sub(circle.position).abs();
  }

  isColliding(circle) {
    const combinedRadius = this.radius + circle.radius;
    return this.distanceTo(circle) <= combinedRadius;
  }

  update(ctx) {
    const {width, height} = ctx.canvas;
    const {position, velocity} = this;
    const {x, y} = position;
    if (x >= width || x <= 0) {
      this.velocity = velocity.mul(new Vector(-1, 1))
    }
    if (y >= height || y <= 0) {
      this.velocity = velocity.mul(new Vector(1, -1))
    }
    this.position = position.add(this.velocity);
  }

  draw(ctx) {
    const {radius} = this;
    const {x, y} = this.position;
    ctx.moveTo(x + radius, y);
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
  }
}

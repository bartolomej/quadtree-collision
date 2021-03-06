import Vector from "./vector.js";


export default class Circle {

  constructor (position = new Vector(0, 0), velocity = new Vector(1, 1), radius = 5) {
    this.position = position;
    this.velocity = velocity;
    this.radius = radius;
    this.collision = false; // is this circle colliding with any other circles
  }

  distanceTo(circle) {
    return this.position.sub(circle.position).abs();
  }

  intersectsCircle(circle) {
    const combinedRadius = this.radius + circle.radius;
    const isTouching = this.distanceTo(circle) <= combinedRadius;
    return isTouching && this !== circle && !this.collision && !circle.collision;
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
    this.collision = false; // reset collision state
  }

  render(ctx) {
    const {radius, collision} = this;
    const {x, y} = this.position;
    ctx.strokeStyle = collision ? '#ff7f00' : 'rgb(72, 72, 72)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.stroke();
  }
}

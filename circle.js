import {QuadtreeElement} from "./quadtree.js";


/**
 * @implements QuadtreeElement
 * @implements Shape2D
 */
export class Circle {

  constructor (position, velocity, radius, color) {
    this.position = position;
    this.velocity = velocity;
    this.radius = radius;
    this.color = color;
  }

  /**
   * @param shape {Shape2D}
   */
  collidesWith(shape) {
    if (shape instanceof Circle) {
      const combinedRadius = this.radius + shape.radius;
      const distance = this.position.sub(shape.position).abs();
      const isTouching = distance <= combinedRadius;
      return isTouching && this !== shape && !this.collision && !shape.collision;
    }

    throw new Error("Collision check not implemented")
  }

  /**
   * Returns if this circle is within the rectangle bounds
   * @param bounds {Rectangle}
   */
  isWithinBounds (bounds) {
    const { x0, y0, x1, y1 } = bounds;
    const { position, radius } = this;
    return (
        x0 <= position.x - radius &&
        x1 >= position.x + radius &&
        y0 <= position.y - radius &&
        y1 >= position.y + radius
    )
  }

  render(ctx) {
    const {radius} = this;
    const {x, y} = this.position;
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.stroke();
  }
}

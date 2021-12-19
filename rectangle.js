export default class Rectangle {

  constructor (x0, y0, x1, y1) {
    this.x0 = x0;
    this.y0 = y0;
    this.x1 = x1;
    this.y1 = y1;
  }

  get width () {
    return this.x1 - this.x0;
  }

  get height () {
    return this.y1 - this.y0;
  }

  get middleX () {
    const { x0, width } = this;
    return x0 + (width / 2);
  }

  get middleY () {
    const { y0, height } = this;
    return y0 + (height / 2);
  }

  /**
   * Returns if a given circle is inside this rectangle.
   * @param circle {Circle}
   */
  isCircleWithinBounds (circle) {
    const { x0, y0, x1, y1 } = this;
    const { position, radius } = circle;
    return (
      x0 <= position.x - radius &&
      x1 >= position.x + radius &&
      y0 <= position.y - radius &&
      y1 >= position.y + radius
    )
  }

  /**
   * Render 2D rectangle on canvas.
   * @param ctx {CanvasRenderingContext2D}
   */
  render (ctx) {
    const { x0, y0, x1, y1, width, height } = this;
    ctx.strokeStyle = 'grey';
    ctx.beginPath();
    ctx.rect(x0, y0, width, height);
    ctx.closePath();
    ctx.stroke();
  }

}

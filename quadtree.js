import Rectangle from "./rectangle.js";
import Circle from "./circle.js";


export default class QuadTree {

  /**
   *
   * @param bounds {Rectangle}
   * @constructor
   */
  constructor (bounds) {
    this.root = new Node(0, bounds);
    this.root.subdivide();
  }

  /**
   *
   * @param circles {Circle[]}
   */
  insertAll (circles) {
    circles.forEach(this.root.insert)
  }

  clear () {
    this.root.clear();
  }

  /**
   *
   * @param circle
   */
  retrieve (circle) {
    this.root.retrieve(circle);
  }

  /**
   * Render quad tree on canvas.
   * @param ctx {CanvasRenderingContext2D}
   */
  render(ctx) {
    this.root.render(ctx);
  }

}

class Node {

  /**
   * @param bounds {Rectangle}
   * @param depth {number}
   * @param value {Circle?}
   * @constructor
   */
  constructor (depth, bounds, value) {
    this.children = [];
    this.depth = depth;
    this.bounds = bounds;
    this.value = value;
  }

  /**
   * Clears the quadtree recursively.
   */
  clear () {}

  /**
   * Split the tree further. Add 4 children to the current node.
   *
   * The boundaries are labeled as follows:
   * 1 | 0
   * —————
   * 2 | 3
   */
  subdivide () {
    const { bounds, depth } = this;
    // top right
    this.children[0] = new Node(depth + 1, new Rectangle(
      bounds.middleX,
      bounds.y0,
      bounds.x1,
      bounds.middleY
    ));
    // top left
    this.children[1] = new Node(depth + 1, new Rectangle(
      bounds.x0,
      bounds.y0,
      bounds.middleX,
      bounds.middleY
    ));
    // bottom left
    this.children[2] = new Node(depth + 1, new Rectangle(
      bounds.x0,
      bounds.middleY,
      bounds.middleX,
      bounds.y1
    ));
    this.children[3] = new Node(depth + 1, new Rectangle(
      bounds.middleX,
      bounds.middleY,
      bounds.x1,
      bounds.y1
    ))
  }

  /**
   * @param circle {Circle}
   */
  getIndex (circle) {}

  /**
   *
   * @param circle {Circle}
   */
  insert (circle) {

  }

  /**
   *
   * @param circle {Circle}
   */
  retrieve (circle) {

  }

  /**
   * Render quad tree node on canvas.
   * @param ctx {CanvasRenderingContext2D}
   */
  render(ctx) {
    this.bounds.render(ctx);
    this.children.forEach(node => node.render(ctx))
  }

}

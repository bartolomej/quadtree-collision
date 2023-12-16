import Rectangle from "./rectangle.js";


export class QuadTree {

  /**
   * @param bounds {Rectangle}
   * @param depth {number}
   * @param elements {QuadtreeElement[]}
   * @constructor
   */
  constructor (bounds, depth= 0, elements = []) {
    this.children = [];
    this.depth = depth;
    this.bounds = bounds;
    this.elements = elements;
  }

  /**
   * Clears the quadtree recursively.
   */
  clear () {
    this.children.forEach(node => node.clear());
    this.elements = [];
    this.children = [];
  }

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
    const childDepth = depth + 1;

    // top right
    this.children[0] = new QuadTree(new Rectangle(
      bounds.middleX,
      bounds.y0,
      bounds.x1,
      bounds.middleY
    ), childDepth);

    // top left
    this.children[1] = new QuadTree(new Rectangle(
      bounds.x0,
      bounds.y0,
      bounds.middleX,
      bounds.middleY
    ), childDepth);

    // bottom left
    this.children[2] = new QuadTree(new Rectangle(
      bounds.x0,
      bounds.middleY,
      bounds.middleX,
      bounds.y1
    ), childDepth);

    // bottom right
    this.children[3] = new QuadTree(new Rectangle(
      bounds.middleX,
      bounds.middleY,
      bounds.x1,
      bounds.y1
    ), childDepth)
  }

  /**
   * Inserts the object into the quadtree.
   * If the node exceeds the capacity,
   * it will be split and add all objects to their corresponding nodes.
   * @param element {QuadtreeElement}
   * @param maxCapacity {number}
   * @param maxDepth {number}
   */
  insert (element, maxCapacity, maxDepth) {
    const childNode = this.children.find(node => element.isWithinBounds(node.bounds))

    if (childNode) {
      childNode.insert(element, maxCapacity, maxDepth);
      return;
    }

    this.elements.push(element);

    if (this.elements.length >= maxCapacity && this.depth < maxDepth) {
      if (this.children.length === 0) {
        this.subdivide();
      }
      // keep the circles that do not belong to any of the child nodes
      this.elements = this.elements.filter(c => {
        const childNode = this.children.find(node => element.isWithinBounds(node.bounds));
        if (childNode) {
          childNode.insert(c, maxCapacity, maxDepth);
        }
        return !childNode;
      })
    }

  }

  /**
   * Render quad tree on canvas.
   * @param ctx {CanvasRenderingContext2D}
   */
  render (ctx) {
    this.bounds.render(ctx);
    this.children.forEach(node => node.render(ctx))
  }

}

/**
 * @interface QuadtreeElement
 *
 * Object that can check if it's within a bounds of a rectangle.
 *
 * This allows us to store multiple objects types
 * within the same quadtree implementation/instance.
 */
export class QuadtreeElement {

  /**
   * Returns if this object is within the rectangle bounds.
   * @param bounds {Rectangle}
   * @returns {boolean}
   */
  isWithinBounds (bounds) {
    throw new Error("Not implemented")
  }
}

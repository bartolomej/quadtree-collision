import Rectangle from "./rectangle.js";
import Circle from "./circle.js";


export default class QuadTree {

  /**
   * Initialises QuadTree object.
   * @param bounds {Rectangle}
   * @param maxNodeCapacity {number}
   * @constructor
   */
  constructor (bounds, maxNodeCapacity = 1) {
    this.maxNodeCapacity = maxNodeCapacity;
    this.root = new Node(0, bounds);
  }

  /**
   * Inserts an array of circles into quadtree.
   * @param circles {Circle[]}
   */
  insertAll (circles) {
    circles.forEach(c => this.root.insert(c, this.maxNodeCapacity))
  }

  /**
   * Inserts single circle into quadtree.
   * @param circle {Circle}
   */
  insert (circle) {
    this.root.insert(circle, this.maxNodeCapacity);
  }

  /**
   * Clears the entire quadtree.
   */
  clear () {
    this.root.clear();
  }

  /**
   * Returns collision candidates - circles that could collide with given circle.
   * @param circle
   */
  retrieve (circle) {
    return this.root.retrieve(circle);
  }

  /**
   * Render quad tree on canvas.
   * @param ctx {CanvasRenderingContext2D}
   */
  render (ctx) {
    this.root.render(ctx);
  }

}

class Node {

  /**
   * @param bounds {Rectangle}
   * @param depth {number}
   * @param circles {Circle[]}
   * @constructor
   */
  constructor (depth, bounds, circles = []) {
    this.children = [];
    this.depth = depth;
    this.bounds = bounds;
    this.circles = circles;
  }

  /**
   * Clears the quadtree recursively.
   */
  clear () {
    this.children.forEach(node => node.clear());
    this.circles = [];
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
    // bottom right
    this.children[3] = new Node(depth + 1, new Rectangle(
      bounds.middleX,
      bounds.middleY,
      bounds.x1,
      bounds.y1
    ))
  }

  /**
   * Determine which children the circle belongs to.
   * If null is returned, the circle cannot fit into any child node,
   * should be part of the parent node.
   * @param circle {Circle}
   */
  getChildNode (circle) {
    return this.children.find(node => node.bounds.isCircleWithinBounds(circle));
  }

  /**
   * Inserts the object into the quadtree.
   * If the node exceeds the capacity,
   * it will be split and add all objects to their corresponding nodes.
   * @param circle {Circle}
   * @param maxNodeCapacity {number}
   */
  insert (circle, maxNodeCapacity) {
    const childNode = this.getChildNode(circle);

    if (childNode) {
      return childNode.insert(circle, maxNodeCapacity);
    }

    this.circles.push(circle);

    if (this.circles.length >= maxNodeCapacity) {
      if (this.children.length === 0) {
        this.subdivide();
      }
      // keep the circles that do not belong to any of the child nodes
      this.circles = this.circles.filter(c => {
        const childNode = this.getChildNode(c);
        if (childNode) {
          childNode.insert(c);
        }
        return !childNode;
      })
    }

  }

  /**
   * Returns collision candidates - circles that could collide with given circle.
   * @param circle {Circle}
   * @param result {Circle[]}
   */
  retrieve (circle, result = []) {
    const childNode = this.getChildNode(circle);

    if (childNode) {
      result.push(...childNode.retrieve(circle));
    }

    result.push(...this.circles);

    return result;
  }

  /**
   * Render quad tree node on canvas.
   * @param ctx {CanvasRenderingContext2D}
   */
  render (ctx) {
    this.bounds.render(ctx);
    this.children.forEach(node => node.render(ctx))
  }

}

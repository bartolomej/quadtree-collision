import Rectangle from "./rectangle.js";


export class QuadTree {

    /**
     * @param bounds {Rectangle}
     * @param maxDepth {number}
     * @param maxCapacity {number}
     * @param depth {number}
     * @param elements {QuadtreeElement[]}
     * @constructor
     */
    constructor(bounds, maxDepth, maxCapacity, depth = 0, elements = []) {
        this.children = [];
        this.maxDepth = maxDepth;
        this.maxCapacity = maxCapacity;
        this.depth = depth;
        this.bounds = bounds;
        this.elements = elements;
    }

    destroy() {
        this.children.forEach(node => node.destroy());
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
    subdivide() {
        const {bounds, depth, maxDepth, maxCapacity} = this;
        const childDepth = depth + 1;

        // top right
        this.children[0] = new QuadTree(
            new Rectangle(
                bounds.middleX,
                bounds.y0,
                bounds.x1,
                bounds.middleY
            ),
            maxDepth,
            maxCapacity,
            childDepth,
        );

        // top left
        this.children[1] = new QuadTree(
            new Rectangle(
                bounds.x0,
                bounds.y0,
                bounds.middleX,
                bounds.middleY
            ),
            maxDepth,
            maxCapacity,
            childDepth,
        );

        // bottom left
        this.children[2] = new QuadTree(
            new Rectangle(
                bounds.x0,
                bounds.middleY,
                bounds.middleX,
                bounds.y1
            ),
            maxDepth,
            maxCapacity,
            childDepth
        );

        // bottom right
        this.children[3] = new QuadTree(
            new Rectangle(
                bounds.middleX,
                bounds.middleY,
                bounds.x1,
                bounds.y1
            ),
            maxDepth,
            maxCapacity,
            childDepth,
        )
    }

    /**
     * @param element {QuadtreeElement}
     */
    insert(element) {
        const childNode = this.children.find(node => element.isWithinBounds(node.bounds))

        if (childNode) {
            childNode.insert(element);
        } else {
            this.elements.push(element);
            this.subdivideIfReachedCapacity();
        }

    }

    /**
     * @param element {QuadtreeElement}
     * @returns {QuadtreeElement[]}
     */
    lookupNeighbourElements(element) {
        const target = this.children.find(node => element.isWithinBounds(node.bounds));
        const neighbours = [];

        if (target) {
            neighbours.push(...target.lookupNeighbourElements(element))
        }

        // TODO: Only the leaf nodes should contain data/elements
        neighbours.push(...this.elements);

        return neighbours;
    }

    subdivideIfReachedCapacity() {
        if (this.elements.length >= this.maxCapacity && this.depth < this.maxDepth) {
            if (this.children.length === 0) {
                this.subdivide();
            }
            // keep the circles that do not belong to any of the child nodes
            this.elements = this.elements.filter(element => {
                const childNode = this.children.find(node => element.isWithinBounds(node.bounds));
                if (childNode) {
                    childNode.insert(element);
                }
                return !childNode;
            })
        }
    }

    /**
     * Render quad tree on canvas.
     * @param ctx {CanvasRenderingContext2D}
     */
    render(ctx) {
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
    isWithinBounds(bounds) {
        throw new Error("Not implemented")
    }
}

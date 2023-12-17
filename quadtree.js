import {Rectangle} from "./rectangle.js";
import {Object2D} from "./2d-object.js";

export class QuadTree {

    /**
     * @param bounds {Rectangle}
     * @param maxDepth {number}
     * @param maxCapacity {number}
     * @param depth {number}
     * @param elements {Object2D[]}
     * @constructor
     */
    constructor(bounds, maxDepth, maxCapacity, depth = 0, elements = []) {
        /**
         * @type {QuadTree[]}
         */
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
     * @param element {Object2D}
     */
    insert(element) {
        if (this.isLeafNode()) {
            this.elements.push(element);
            this.subdivideIfReachedCapacity();
        } else {
            const targetNode = this.findTargetChildOrThrow(element);
            targetNode.insert(element);
        }
    }

    /**
     * @param element {Object2D}
     * @returns {Object2D[]}
     */
    lookupNeighbourElements(element) {
        if (this.isLeafNode()) {
            return this.elements;
        } else {
            return this.findTargetChildOrThrow(element).lookupNeighbourElements(element)
        }
    }

    subdivideIfReachedCapacity() {
        if (!this.isLeafNode()) {
            throw new Error("Assertion: Cannot subdivide non-leaf node")
        }

        if (this.elements.length >= this.maxCapacity && this.depth < this.maxDepth) {
            this.subdivide();

            for (const element of this.elements) {
                const targetNode = this.findTargetChildOrThrow(element)
                targetNode.insert(element);
            }
        }
    }

    /**
     * @param element {Object2D}
     * @returns {QuadTree}
     */
    findTargetChildOrThrow(element) {
        const targetNode = this.children.find(node => this.isElementWithinBounds(element, node.bounds));

        if (!targetNode) {
            throw new Error(`Assertion: Target node not found for element (${JSON.stringify(element)})`)
        }

        return targetNode;
    }

    /**
     * Returns true, if an object is within the rectangle bounds
     * @param element {Object2D}
     * @param bounds {Rectangle}
     */
    isElementWithinBounds(element, bounds) {
        return (
            bounds.x0 <= element.position.x &&
            bounds.x1 >= element.position.x &&
            bounds.y0 <= element.position.y &&
            bounds.y1 >= element.position.y
        )
    }

    isLeafNode() {
        return this.children.length === 0;
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

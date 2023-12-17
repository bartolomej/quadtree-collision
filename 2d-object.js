import {Vector} from "./vector.js"
import {Rectangle} from "./rectangle.js"

/**
 * @interface Object2D
 *
 * Represents any 2D object.
 */
export class Object2D {
    /**
     * @property position
     * @type {Vector}
     */
    position;

    /**
     * @property velocity
     * @type {Vector}
     */
    velocity;

    /**
     * @property color
     * @type {string}
     */
    color;

    /**
     * Returns true, if the object is contained within the rectangle bounds.
     * @param bounds {Rectangle}
     * @return {boolean}
     */
    isWithinBounds(bounds) {
        throw new Error("Not implemented")
    }

    /**
     * Check if collides with another 2D object.
     * @param target {Object2D}
     * @returns {boolean}
     */
    collidesWith(target) {
        throw new Error("Not implemented")
    }

    /**
     * @param ctx {CanvasRenderingContext2D}
     * @returns {void}
     */
    render(ctx) {
        throw new Error("Not implemented")
    }
}

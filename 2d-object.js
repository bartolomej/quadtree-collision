import {Vector} from "./vector.js"
import {Rectangle} from "./rectangle.js"

/**
 * @interface Object2D
 *
 * Any 2D object that implements this interface could be used in this visualization.
 * I initially wanted to add more examples of 2D shapes (e.g. rectangles) as a test, but ran out of time.
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

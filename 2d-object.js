import {Vector} from "./vector.js"

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

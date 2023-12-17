import {Object2D} from "./2d-object.js"

/**
 * @implements Object2D
 */
export class Circle {

    /**
     * @param position {Vector}
     * @param velocity {Vector}
     * @param radius {number}
     * @param color {string}
     */
    constructor(position, velocity, radius, color) {
        this.position = position;
        this.velocity = velocity;
        this.radius = radius;
        this.color = color;
    }

    collidesWith(object) {
        if (object instanceof Circle) {
            const combinedRadius = this.radius + object.radius;
            const distance = this.position.sub(object.position).abs();
            return distance <= combinedRadius;
        }

        throw new Error("Collision check not implemented")
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

    isWithinBounds(bounds) {
        return (
            bounds.x0 <= this.position.x - this.radius &&
            bounds.x1 >= this.position.x + this.radius &&
            bounds.y0 <= this.position.y - this.radius &&
            bounds.y1 >= this.position.y + this.radius
        )
    }
}

/**
 * @interface CollisionDetectionStrategy
 */
class CollisionDetectionStrategy {

    /**
     * @param shapes {Shape2D[]}
     * @returns {Shape2D[][]}
     */
    getCollidingPairs(shapes) {
        throw new Error("Not implemented")
    }
}

/**
 * @interface Shape2D
 *
 *
 */
class Shape2D {

    /**
     * Check if collides with another shape.
     * @param shape {Shape2D}
     * @returns {boolean}
     */
    collidesWith(shape) {
        throw new Error("Not implemented")
    }
}


/**
 * @implements CollisionDetectionStrategy
 */
export class QuadtreeCollisionDetection {

    getCollidingPairs(shapes) {
        return [];
    }
}

/**
 * @implements CollisionDetectionStrategy
 */
export class BruteforceCollisionDetection {

    getCollidingPairs(shapes) {
        return [];
    }
}

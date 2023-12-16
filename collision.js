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

    /**
     * @param quadTree {QuadTree}
     */
    constructor(quadTree) {
        this.quadTree = quadTree
    }


    getCollidingPairs(shapes) {
        const pairs = [];

        this.quadTree.destroy();

        for (const shape of shapes) {
            this.quadTree.insert(shape);
        }

        for (const shape of shapes) {
            const collisionCandidates = this.quadTree.lookupNeighbourElements(shape);

            for (const candidate of collisionCandidates) {
                if (shape.collidesWith(candidate)) {
                    pairs.push([shape, candidate])
                }
            }
        }

        return pairs;
    }
}

/**
 * @implements CollisionDetectionStrategy
 */
export class BruteforceCollisionDetection {

    getCollidingPairs(shapes) {
        const pairs = [];
        for (const shapeA of shapes) {
            for (const shapeB of shapes) {
                if (shapeA.collidesWith(shapeB)) {
                    pairs.push([shapeA, shapeB])
                }
            }
        }
        return pairs;
    }
}

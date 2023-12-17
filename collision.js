import {Object2D} from "./2d-object.js"

/**
 * @interface CollisionDetectionStrategy
 */
class CollisionDetectionStrategy {

    /**
     * @param objects {Object2D[]}
     * @returns {Object2D[][]}
     */
    getCollidingPairs(objects) {
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


    getCollidingPairs(objects) {
        const pairs = [];

        this.quadTree.destroy();

        for (const shape of objects) {
            this.quadTree.insert(shape);
        }

        for (const objectA of objects) {
            const collisionCandidates = this.quadTree.lookupNeighbourElements(objectA);

            for (const objectB of collisionCandidates) {
                if (objectA !== objectB && objectA.collidesWith(objectB)) {
                    pairs.push([objectA, objectB])
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

    getCollidingPairs(objects) {
        const pairs = [];
        for (const objectA of objects) {
            for (const objectB of objects) {
                if (objectA !== objectB && objectA.collidesWith(objectB)) {
                    pairs.push([objectA, objectB])
                }
            }
        }
        return pairs;
    }
}

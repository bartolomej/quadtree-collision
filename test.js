import Rectangle from "./rectangle";
import {Circle} from "./circle";
import {QuadTree} from "./quadtree";
import Vector from "./vector";

const initCircle = (x, y, r) => new Circle(new Vector(x, y), 0, r);


describe("Should test Rectangle class", function () {

  it('should return true if circle within rectangle bounds', function () {
     const rect = new Rectangle(0, 0, 10, 10);
     // bottom left edge
     expect(rect.isCircleWithinBounds(initCircle(0, 0, 1))).toBeFalsy();
     expect(rect.isCircleWithinBounds(initCircle(1, 1, 1))).toBeTruthy();
     // top right edge
     expect(rect.isCircleWithinBounds(initCircle(10, 10, 1))).toBeFalsy();
     expect(rect.isCircleWithinBounds(initCircle(9, 9, 1))).toBeTruthy();
  });

})

describe("Should test QuadTree class", function () {

  it('should insert and check possible collisions', function () {
    const tree = new QuadTree(new Rectangle(0, 0, 10, 10), 3);
    tree.insert(initCircle(9, 9, 1)); // bottom left of the bottom left quadrant
    tree.insert(initCircle(9, 9, 1));

    expect(tree.root.children).toHaveLength(0);
    expect(tree.root.circles).toHaveLength(2);

    tree.insert(initCircle(6, 6, 1)); // in top right of the bottom left quadrant
    tree.insert(initCircle(6, 6, 1));

    expect(tree.root.children).toHaveLength(4);
    expect(tree.root.circles).toHaveLength(0);
    expect(tree.root.children[3].children).toHaveLength(4);

    expect(tree.root.children[3].children[1].circles).toHaveLength(2);
    expect(tree.root.children[3].children[3].circles).toHaveLength(2);

    expect(tree.retrieve(initCircle(9, 9, 1))).toHaveLength(2);
  });

})

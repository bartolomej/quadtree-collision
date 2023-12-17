export class Vector {
  constructor (coords, ...rest) {
    // vector coordinates can be given in an array form: [x,y,z,..]
    // or in argument list form: x,y,z,..
    if (coords instanceof Array) {
      this._coords = coords;
    } else {
      this._coords = [coords, ...rest]
    }
  }

  get x () {
    return this._coords[0];
  }

  set x (value) {
    this._coords[0] = value;
  }

  get y () {
    return this._coords[1];
  }

  set y (value) {
    this._coords[1] = value;
  }

  length () {
    return this._coords.length;
  }

  neg () {
    return new Vector(this._coords.map(p => -p));
  }

  add (v) {
    return Vector.map(this, v, (p1, p2) => p1 + p2);
  }

  sub (v) {
    return Vector.map(this, v, (p1, p2) => p1 - p2);
  }

  mul (v) {
    return Vector.map(this, v, (p1, p2) => p1 * p2);
  }

  div (v) {
    return Vector.map(this, v, (p1, p2) => p1 / p2);
  }

  dotProduct (v) {
    return this.mul(v).toArray().reduce((p, c) => p + c, 0);
  }

  mulScalar (s) {
    return new Vector(this._coords.map(p => p * s))
  }

  divScalar (s) {
    return new Vector(this._coords.map(p => p / s))
  }

  toArray () {
    return this._coords;
  }

  abs () {
    return Math.sqrt(
      this._coords
        .map(p => Math.pow(p, 2))
        .reduce((p, c) => p + c, 0),
    );
  }

  static map (v1, v2, cb) {
    if (v1.length() !== v2.length()) {
      throw new Error("Vectors must have equal length");
    }
    const coords1 = v1.toArray();
    const coords2 = v2.toArray();
    return new Vector(coords1.map((p1, i) => cb(p1, coords2[i])))
  }
}

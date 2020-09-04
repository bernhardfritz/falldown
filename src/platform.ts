import AABB from "./aabb";
import HasAABB from "./has-aabb";

export default class Platform implements HasAABB {

    static readonly COLOR = new Uint8ClampedArray([0, 255, 0]);

    constructor(public aabb: AABB) {}

}
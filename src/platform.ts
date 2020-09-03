import AABB from "./aabb";

export default class Platform {

    static readonly COLOR = new Uint8ClampedArray([0, 255, 0]);

    constructor(public aabb: AABB) {}

}
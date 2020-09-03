import AABB from "./aabb";
import Constants from "./constants";
import { vec2 } from "./vec2";

export default class Ball {

    static readonly COLOR = new Uint8ClampedArray([255, 0, 0]);

    v: vec2 = [ 0, Constants.VY ];

    constructor(public aabb: AABB) {}

}
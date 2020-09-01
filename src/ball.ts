import AABB from "./aabb";
import Constants from "./constants";
import { vec2 } from "./vec2";

export default class Ball {

    v: vec2 = [ 0, Constants.VY ];

    constructor(public aabb: AABB) {}

}
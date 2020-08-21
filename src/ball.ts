import Constants from "./constants";
import { vec2 } from "./vec2";
import AABB from "./aabb";

export default class Ball {

    v: vec2 = [ 0, 0 ];
    a: vec2 = Constants.G;

    constructor(public aabb: AABB) {}

}
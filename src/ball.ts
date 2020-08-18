import Constants from "./constants";
import { vec2 } from "./vec2";

export default class Ball {

    v: vec2 = [ 0, 0 ];
    a: vec2 = Constants.G;

    constructor(public r: vec2) {} // r ... position vector

}
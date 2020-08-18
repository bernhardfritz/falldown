import { vec2 } from "./vec2";

export default class Constants {

    static readonly G: vec2 = [ 0, 9.80665 ]; // gravity
    static readonly VT: vec2 = [ 0, 0.25 ]; // terminal velocity

    private constructor() {}

}
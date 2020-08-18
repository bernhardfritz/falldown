export type vec2 = [number, number];

export default class Vec2 {

    private constructor() {}

    static add(a: vec2, b: vec2): vec2 {
        return [ a[0] + b[0], a[1] + b[1] ];
    }

    static scale(a: vec2, b: number): vec2 {
        return [ a[0] * b, a[1] * b ];
    }

    static len2(a: vec2): number {
        return a[0] * a[0] + a[1] * a[1];
    }

    static len(a: vec2): number {
        return Math.sqrt(Vec2.len2(a));
    }

    static min(a: vec2, b: vec2): vec2 {
        return Vec2.len2(b) < Vec2.len2(a) ? b : a;
    }

}
import Vec2, { vec2 } from "./vec2";

export default class AABB {
    
    constructor(public center: vec2, public halfDimension: vec2) {}

    intersects(that: AABB): boolean {
        const sum = Vec2.add(this.halfDimension, that.halfDimension);
        return Math.abs(this.center[0] - that.center[0]) <= sum[0] && Math.abs(this.center[1] - that.center[1]) <= sum[1];
    }

    intersectsPoint(point: vec2): boolean {
        return Math.abs(this.center[0] - point[0]) <= this.halfDimension[0] && Math.abs(this.center[1] - point[1]) <= this.halfDimension[1];
    }

    get left(): number {
        return this.center[0] - this.halfDimension[0];
    }

    get right(): number {
        return this.center[0] + this.halfDimension[0];
    }

    get top(): number {
        return this.center[1] - this.halfDimension[1];
    }

    get bottom(): number {
        return this.center[1] + this.halfDimension[1];
    }

}
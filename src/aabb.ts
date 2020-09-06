import Vec2, { vec2 } from "./vec2";

export default class AABB {
    
    constructor(public center: vec2, public halfDimension: vec2) {}

    intersects(that: AABB): boolean {
        const sum = Vec2.add(this.halfDimension, that.halfDimension);
        return Math.abs(this.center[0] - that.center[0]) <= sum[0] && Math.abs(this.center[1] - that.center[1]) <= sum[1];
    }

    containsPoint(x: number, y: number): boolean {
        return Math.abs(this.center[0] - x) <= this.halfDimension[0] && Math.abs(this.center[1] - y) <= this.halfDimension[1];
    }

    get minX(): number {
        return this.center[0] - this.halfDimension[0];
    }

    get maxX(): number {
        return this.center[0] + this.halfDimension[0];
    }

    get minY(): number {
        return this.center[1] - this.halfDimension[1];
    }

    get maxY(): number {
        return this.center[1] + this.halfDimension[1];
    }

}
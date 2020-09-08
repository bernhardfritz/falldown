import Renderer from "./renderer";
import State from "./state";

export default class CanvasRenderer implements Renderer {

    protected readonly ctx: CanvasRenderingContext2D;

    constructor(canvas: HTMLCanvasElement) {
        this.ctx = canvas.getContext('2d');
    }

    render(state: State): void {
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.ctx.fillStyle = '#0f0';
        for (const platform of state.platforms) {
            this.ctx.fillRect(platform.aabb.minX, platform.aabb.minY, 2 * platform.aabb.halfDimension[0], 2 * platform.aabb.halfDimension[1]);
        }
        this.ctx.fillStyle = '#f00';
        this.ctx.fillRect(state.ball.aabb.minX, state.ball.aabb.minY, 2 * state.ball.aabb.halfDimension[0], 2 * state.ball.aabb.halfDimension[1]);
    }

}
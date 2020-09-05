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
        for (const platform of state.platforms.all()) {
            this.ctx.fillRect(platform.aabb.minX, platform.aabb.minY, 2 * platform.aabb.halfDimension[0], 2 * platform.aabb.halfDimension[1]);
        }
        this.ctx.fillStyle = '#f00';
        this.ctx.beginPath();
        this.ctx.arc(state.ball.aabb.center[0], state.ball.aabb.center[1], state.ball.aabb.halfDimension[0], 0, 2 * Math.PI);
        this.ctx.fill();
        this.ctx.closePath();
    }

}
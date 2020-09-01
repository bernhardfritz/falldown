import Renderer from "./renderer";
import State from "./state";

export default class CanvasRenderer implements Renderer {

    readonly ctx: CanvasRenderingContext2D;

    constructor(private canvas: HTMLCanvasElement) {
        this.ctx = canvas.getContext('2d');
    }

    render(state: State): void {
        this.ctx.save();
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.ctx.fillStyle = '#0f0';
        for (const platform of state.platforms) {
            const x = platform.aabb.left;
            const y = platform.aabb.top;
            const w = 2 * platform.aabb.halfDimension[0];
            const h = 2 * platform.aabb.halfDimension[1];
            this.ctx.fillRect(x, y, w, h);
        }
        this.ctx.fillStyle = '#f00';
        this.ctx.beginPath();
        const x = state.ball.aabb.center[0];
        const y = state.ball.aabb.center[1];
        const radius = state.ball.aabb.halfDimension[0];
        const startAngle = 0;
        const endAngle = 2 * Math.PI;
        this.ctx.arc(x, y, radius, startAngle, endAngle);
        this.ctx.fill();
        this.ctx.closePath();
        this.ctx.restore();
    }

}
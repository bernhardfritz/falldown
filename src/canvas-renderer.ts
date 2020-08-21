import Renderer from "./renderer";
import State from "./state";

export default class CanvasRenderer implements Renderer {

    readonly ctx: CanvasRenderingContext2D;

    constructor(private canvas: HTMLCanvasElement) {
        this.ctx = canvas.getContext('2d');
    }

    render(state: State) {
        this.ctx.save();
        this.ctx.scale(10, 10);
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, 80, 160);
        this.ctx.fillStyle = '#0f0';
        for (const platform of state.platforms) {
            this.ctx.fillRect(platform.aabb.left, platform.aabb.top, platform.aabb.right - platform.aabb.left, platform.aabb.bottom - platform.aabb.top);
        }
        this.ctx.fillStyle = '#f00';
        this.ctx.beginPath();
        this.ctx.arc(state.ball.aabb.center[0], state.ball.aabb.center[1], state.ball.aabb.halfDimension[0], 0, 2 * Math.PI);
        this.ctx.fill();
        this.ctx.closePath();
        this.ctx.restore();
    }

}
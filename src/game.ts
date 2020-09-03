import AABB from "./aabb";
import AbstractGame from "./abstract-game";
import CanvasBasedConsoleRenderer from "./canvas-based-renderer";
import CanvasRenderer from "./canvas-renderer";
import ConsoleRenderer from "./console-renderer";
import Platform from "./platform";
import Renderer from "./renderer";
import State from "./state";
import StyledConsoleRenderer from "./styled-console-renderer";
import Vec2 from "./vec2";

export default class Game extends AbstractGame {

    private readonly WIDTH = 230;
    private readonly HEIGHT = 408;
    private readonly FLOORS_PER_SCREEN = 7;
    private readonly FLOOR_HEIGHT = 10;
    private readonly HOLE_WIDTH_FRACTION = 1 / 5;
    private readonly BALL_RADIUS_WIDTH_FRACTION = 1 / 20;
    state: State;
    private renderers: Renderer[] = [];
    private time: number;

    constructor() {
        super();
        this.state = new State();
        const holeWidth = this.HOLE_WIDTH_FRACTION * this.WIDTH;
        const ballRadius = this.BALL_RADIUS_WIDTH_FRACTION * this.WIDTH;
        let firstHole;
        for (let y = this.FLOOR_HEIGHT / 2; y < this.HEIGHT; y += this.HEIGHT / this.FLOORS_PER_SCREEN) {
            const hole = holeWidth + (this.WIDTH - 2 * holeWidth) * Math.random();
            if (firstHole === undefined) {
                firstHole = hole;    
            }
            const l1 = (hole - holeWidth / 2) - 0;
            const l2 = this.WIDTH - (hole + holeWidth / 2);
            this.state.platforms.push(new Platform(new AABB([l1 / 2, y], [l1 / 2, this.FLOOR_HEIGHT / 2])));
            this.state.platforms.push(new Platform(new AABB([hole + holeWidth / 2 + l2 / 2, y], [l2 / 2, this.FLOOR_HEIGHT / 2])));
        }
        this.state.ball.aabb.center[0] = firstHole;
        this.state.ball.aabb.halfDimension[0] = ballRadius;
        this.state.ball.aabb.halfDimension[1] = ballRadius;
        // this.renderers.push(new ConsoleRenderer(this.WIDTH, this.HEIGHT, 20, 40));
        this.renderers.push(new StyledConsoleRenderer(this.WIDTH, this.HEIGHT, 20, 40));
        /*   for debug   */
        const canvas = document.createElement('canvas');
        canvas.width = this.WIDTH;
        canvas.height = this.HEIGHT;
        document.body.appendChild(canvas);
        // this.renderers.push(new CanvasRenderer(canvas));
        /*               */
        // this.renderers.push(new CanvasBasedConsoleRenderer(canvas, 20, 40));
    }
    
    loop(time: number): void {
        const dt = this.time !== undefined ? (time - this.time) / 1_000 : 0;
        this.time = time;
        this.update(dt);
        this.render();
    }

    update(dt: number): void {
        if (this.state.ball.v[1] !== 0) {
            this.state.ball.aabb.center = Vec2.add(this.state.ball.aabb.center, [0, this.state.ball.v[1]]);
            for (const platform of this.state.platforms) {
                if (this.state.ball.aabb.intersects(platform.aabb)) {
                    const diff = (this.state.ball.aabb.halfDimension[1] + platform.aabb.halfDimension[1]) - Math.abs(this.state.ball.aabb.center[1] - platform.aabb.center[1]);
                    this.state.ball.aabb.center = Vec2.sub(this.state.ball.aabb.center, [0, Math.sign(this.state.ball.v[1]) * (diff + 0.001)]);
                    break;
                }
            }
        }
        if (this.state.ball.v[0] !== 0) {
            this.state.ball.aabb.center = Vec2.add(this.state.ball.aabb.center, [this.state.ball.v[0], 0]);
            for (const platform of this.state.platforms) {
                if (this.state.ball.aabb.intersects(platform.aabb)) {
                    const diff = (this.state.ball.aabb.halfDimension[0] + platform.aabb.halfDimension[0]) - Math.abs(this.state.ball.aabb.center[0] - platform.aabb.center[0]);
                    this.state.ball.aabb.center = Vec2.sub(this.state.ball.aabb.center, [Math.sign(this.state.ball.v[0]) * (diff + 0.001), 0]);
                    break;
                }
            }
        }
        if (this.state.ball.aabb.left < 0) {
            this.state.ball.aabb.center = [0 + this.state.ball.aabb.halfDimension[0], this.state.ball.aabb.center[1]];
        }
        if (this.state.ball.aabb.right > this.WIDTH) {
            this.state.ball.aabb.center = [this.WIDTH - this.state.ball.aabb.halfDimension[0], this.state.ball.aabb.center[1]];
        }
        if (this.state.ball.aabb.top < 0) {
            this.state.ball.aabb.center = [this.state.ball.aabb.center[0], 0 + this.state.ball.aabb.halfDimension[1]];
        }
        if (this.state.ball.aabb.bottom > this.HEIGHT) {
            this.state.ball.aabb.center = [this.state.ball.aabb.center[0], this.HEIGHT - this.state.ball.aabb.halfDimension[1]];
        }
    }

    render(): void {
        for (const renderer of this.renderers) {
            renderer.render(this.state);
        }
    }

}
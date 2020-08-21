import AbstractGame from "./abstract-game";
import Platform from "./platform";
import State from "./state";
import Renderer from "./renderer";
import ConsoleRenderer from "./console-renderer";
import StyledConsoleRenderer from "./styled-console-renderer";
import Constants from "./constants";
import Vec2 from "./vec2";
import AABB from "./aabb";
import CanvasRenderer from "./canvas-renderer";

export default class Game extends AbstractGame {

    private readonly HEIGHT = 16;
    private readonly WIDTH = 8;
    state: State;
    private renderer: Renderer;
    private time: number;

    constructor() {
        super();
        this.state = new State();
        let firstHole;
        for (let y = 0.5; y < this.HEIGHT; y += 3) {
            const hole = 1.5 + Math.random() * (this.WIDTH - 3);
            if (firstHole === undefined) {
                firstHole = hole;    
            }
            const l1 = (hole - 1) - 0;
            const l2 = this.WIDTH - (hole + 1);
            this.state.platforms.push(new Platform(new AABB([0 + l1 / 2, y], [l1 / 2, 0.5])));
            this.state.platforms.push(new Platform(new AABB([hole + 1 + l2 / 2, y], [l2 / 2, 0.5])));
        }
        this.state.ball.aabb.center[0] = firstHole;
        // this.renderer = new ConsoleRenderer(this.HEIGHT, this.WIDTH);
        this.renderer = new StyledConsoleRenderer(this.HEIGHT, this.WIDTH);
        // this.renderer = new CanvasRenderer(document.getElementById('canvas') as HTMLCanvasElement); // for debug
    }
    
    loop(time: number): void {
        const dt = this.time !== undefined ? (time - this.time) / 1_000 : 0;
        this.time = time;
        this.update(dt);
        this.render();
    }

    update(dt: number): void {
        this.state.ball.v = Vec2.min(Vec2.add(this.state.ball.v, Vec2.scale(this.state.ball.a, dt)), Constants.VT);
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
        this.renderer.render(this.state);
    }

}
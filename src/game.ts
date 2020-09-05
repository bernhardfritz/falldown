import AABB from "./aabb";
import AbstractGame from "./abstract-game";
import CanvasBasedConsoleRenderer from "./canvas-based-renderer";
import CanvasRenderer from "./canvas-renderer";
import ConsoleRenderer from "./console-renderer";
import Platform from "./platform";
import Renderer from "./renderer";
import State from "./state";
import StyledConsoleRenderer from "./styled-console-renderer";
import Vec2, { vec2 } from "./vec2";

export default class Game extends AbstractGame {

    private static readonly _WIDTH = 230;
    private static readonly _HEIGHT = 408;
    private static readonly _COLS = 20;
    private static readonly _ROWS = 40;
    private static readonly _FLOORS_PER_SCREEN = 7;
    private static readonly _FLOOR_HEIGHT = 10;
    private static readonly _HOLE_WIDTH_FRACTION = 1 / 5;
    private static readonly _BALL_RADIUS_WIDTH_FRACTION = 1 / 20;
    private readonly _state: State = new State();
    private readonly _renderers: Renderer[] = [];

    constructor() {
        super();
        const holeWidth = Game._HOLE_WIDTH_FRACTION * Game._WIDTH;
        const ballRadius = Game._BALL_RADIUS_WIDTH_FRACTION * Game._WIDTH;
        let firstHole;
        const platforms = [];
        for (let y = Game._FLOOR_HEIGHT / 2; y < Game._HEIGHT; y += Game._HEIGHT / Game._FLOORS_PER_SCREEN) {
            const hole = holeWidth + (Game._WIDTH - 2 * holeWidth) * Math.random();
            if (firstHole === undefined) {
                firstHole = hole;    
            }
            const l1 = (hole - holeWidth / 2) - 0;
            const l2 = Game._WIDTH - (hole + holeWidth / 2);
            platforms.push(new Platform(new AABB([l1 / 2, y], [l1 / 2, Game._FLOOR_HEIGHT / 2])), new Platform(new AABB([hole + holeWidth / 2 + l2 / 2, y], [l2 / 2, Game._FLOOR_HEIGHT / 2])));
        }
        this._state.platforms.load(platforms);
        this._state.ball.aabb.center[0] = firstHole;
        this._state.ball.aabb.halfDimension[0] = ballRadius;
        this._state.ball.aabb.halfDimension[1] = ballRadius;
        // this._renderers.push(new ConsoleRenderer(Game._WIDTH, Game._HEIGHT, Game._COLS, Game._ROWS));
        // this._renderers.push(new StyledConsoleRenderer(Game._WIDTH, Game._HEIGHT, Game._COLS, Game._ROWS));
        const canvas = document.createElement('canvas');
        canvas.width = Game._WIDTH;
        canvas.height = Game._HEIGHT;
        // document.body.appendChild(canvas); // for debug
        // this._renderers.push(new CanvasRenderer(canvas));
        this._renderers.push(new CanvasBasedConsoleRenderer(canvas, Game._COLS, Game._ROWS));
    }

    get state(): State {
        return this._state;
    }
    
    loop(dt: number): void {
        this.update(dt);
        this.render();
    }

    update(dt: number): void {
        if (this._state.ball.v[1] !== 0) {
            const ds: vec2 = [ 0, this._state.ball.v[1] * dt ];
            this._state.ball.aabb.center = Vec2.add(this._state.ball.aabb.center, ds);
            const platforms = this._state.platforms.search(this._state.ball.aabb);
            if (platforms.length > 0) {
                const diff = (this._state.ball.aabb.halfDimension[1] + platforms[0].aabb.halfDimension[1]) - Math.abs(this._state.ball.aabb.center[1] - platforms[0].aabb.center[1]);
                this._state.ball.aabb.center = Vec2.sub(this._state.ball.aabb.center, [0, Math.sign(ds[1]) * (diff + 0.001)]);
            }
        }
        if (this._state.ball.v[0] !== 0) {
            const ds: vec2 = [ this._state.ball.v[0] * dt, 0 ];
            this._state.ball.aabb.center = Vec2.add(this._state.ball.aabb.center, ds);
            const platforms = this._state.platforms.search(this._state.ball.aabb);
            if (platforms.length > 0) {
                const diff = (this._state.ball.aabb.halfDimension[0] + platforms[0].aabb.halfDimension[0]) - Math.abs(this._state.ball.aabb.center[0] - platforms[0].aabb.center[0]);
                this._state.ball.aabb.center = Vec2.sub(this._state.ball.aabb.center, [Math.sign(ds[0]) * (diff + 0.001), 0]);
            }
        }
        if (this._state.ball.aabb.minX < 0) {
            this._state.ball.aabb.center = [0 + this._state.ball.aabb.halfDimension[0], this._state.ball.aabb.center[1]];
        }
        if (this._state.ball.aabb.maxX > Game._WIDTH) {
            this._state.ball.aabb.center = [Game._WIDTH - this._state.ball.aabb.halfDimension[0], this._state.ball.aabb.center[1]];
        }
        if (this._state.ball.aabb.minY < 0) {
            this._state.ball.aabb.center = [this._state.ball.aabb.center[0], 0 + this._state.ball.aabb.halfDimension[1]];
        }
        if (this._state.ball.aabb.maxY > Game._HEIGHT) {
            this._state.ball.aabb.center = [this._state.ball.aabb.center[0], Game._HEIGHT - this._state.ball.aabb.halfDimension[1]];
        }
    }

    render(): void {
        for (const renderer of this._renderers) {
            renderer.render(this._state);
        }
    }

}
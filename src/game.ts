import AABB from "./aabb";
import AbstractGame from "./abstract-game";
import CanvasBasedConsoleRenderer from "./canvas-based-renderer";
import CanvasRenderer from "./canvas-renderer";
import ConsoleRenderer from "./console-renderer";
import Data from "./data";
import Platform from "./platform";
import Renderer from "./renderer";
import State from "./state";
import StyledConsoleRenderer from "./styled-console-renderer";
import Utils from "./utils";
import Vec2, { vec2 } from "./vec2";

export default class Game extends AbstractGame {

    private static readonly _WIDTH = 200;
    private static readonly _HEIGHT = 400;
    private static readonly _COLS = 20;
    private static readonly _ROWS = 40;
    private static readonly _FLOORS_PER_SCREEN = 7;
    private static readonly _FLOOR_HEIGHT = 10;
    private static readonly _HOLE_WIDTH = Game._WIDTH / 5;
    private static readonly _BALL_RADIUS = Game._WIDTH / 20;
    private readonly _state: State = new State();
    private readonly _renderer: Renderer;

    constructor() {
        super();
        for (let y = Game._FLOOR_HEIGHT / 2 + 2 * Game._HEIGHT / Game._FLOORS_PER_SCREEN; y < Game._HEIGHT + 3 * Game._HEIGHT / Game._FLOORS_PER_SCREEN; y += Game._HEIGHT / Game._FLOORS_PER_SCREEN) { // 7 + 1 off-screen
            this.state.platforms.push(...this._generateFloor(y));
        }
        const firstHole = this.state.platforms[0].aabb.maxX + Game._HOLE_WIDTH / 2;
        this._state.ball.aabb.center = [ firstHole, Game._BALL_RADIUS ];
        this._state.ball.aabb.halfDimension = [ Game._BALL_RADIUS, Game._BALL_RADIUS ];
        // this._renderer = new ConsoleRenderer(Game._WIDTH, Game._HEIGHT, Game._COLS, Game._ROWS);
        // this._renderer = new StyledConsoleRenderer(Game._WIDTH, Game._HEIGHT, Game._COLS, Game._ROWS);
        const canvas = document.createElement('canvas');
        canvas.width = Game._WIDTH;
        canvas.height = Game._HEIGHT;
        // document.body.appendChild(canvas); // for debug
        // this._renderer = new CanvasRenderer(canvas);
        this._renderer = new CanvasBasedConsoleRenderer(canvas, Game._COLS, Game._ROWS);
    }

    get state(): State {
        return this._state;
    }
    
    update(dt: number): void {
        const dy = -(0.05 + Math.floor(this._state.score / 10) * 0.01) * dt;
        this._state.ball.aabb.center[1] += dy;
        const platformsToBeRemoved = [];
        for (const platform of this.state.platforms) {
            platform.aabb.center[1] += dy;
            if (platform.aabb.maxY < 0) {
                platformsToBeRemoved.push(platform);
            }
        }
        if (platformsToBeRemoved.length > 0) {
            for (const platformToBeRemoved of platformsToBeRemoved) {
                this.state.platforms.splice(this.state.platforms.indexOf(platformToBeRemoved), 1);
            }
            this.state.score += platformsToBeRemoved.length / 2;
            this.state.platforms.push(...this._generateFloor(platformsToBeRemoved[platformsToBeRemoved.length - 1].aabb.center[1] + Game._HEIGHT + Game._HEIGHT / Game._FLOORS_PER_SCREEN));
        }
        if (this._state.ball.v[1] !== 0) {
            const ds: vec2 = [ 0, this._state.ball.v[1] * dt ];
            this._state.ball.aabb.center = Vec2.add(this._state.ball.aabb.center, ds);
            for (const platform of this.state.platforms) {
                if (platform.aabb.maxY < this.state.ball.aabb.minY) {
                    continue;
                }
                if (this.state.ball.aabb.intersects(platform.aabb)) {
                    const diff = (this._state.ball.aabb.halfDimension[1] + platform.aabb.halfDimension[1]) - Math.abs(this._state.ball.aabb.center[1] - platform.aabb.center[1]);
                    this._state.ball.aabb.center = Vec2.sub(this._state.ball.aabb.center, [0, Math.sign(ds[1]) * (diff + 0.001)]);
                    break;
                }
            }
        }
        if (this._state.ball.v[0] !== 0) {
            const ds: vec2 = [ this._state.ball.v[0] * dt, 0 ];
            this._state.ball.aabb.center = Vec2.add(this._state.ball.aabb.center, ds);
            for (const platform of this.state.platforms) {
                if (this.state.ball.aabb.intersects(platform.aabb)) {
                    const diff = (this._state.ball.aabb.halfDimension[0] + platform.aabb.halfDimension[0]) - Math.abs(this._state.ball.aabb.center[0] - platform.aabb.center[0]);
                    this._state.ball.aabb.center = Vec2.sub(this._state.ball.aabb.center, [Math.sign(ds[0]) * (diff + 0.001), 0]);
                    break;
                }
            }
        }
        if (this._state.ball.aabb.minX < 0) {
            this._state.ball.aabb.center = [0 + this._state.ball.aabb.halfDimension[0], this._state.ball.aabb.center[1]];
        }
        if (this._state.ball.aabb.maxX > Game._WIDTH) {
            this._state.ball.aabb.center = [Game._WIDTH - this._state.ball.aabb.halfDimension[0], this._state.ball.aabb.center[1]];
        }
        if (this._state.ball.aabb.minY < 0) {
            this.stop();
            this._state.gameover = true;
            window.setTimeout(() => {
                const item = window.localStorage.getItem('falldown');
                const data: Data = item !== null ? JSON.parse(item) : { highscore: 0 };
                const newHighscore = this._state.score > data.highscore;
                if (newHighscore) {
                    data.highscore = this._state.score;
                    window.localStorage.setItem('falldown', JSON.stringify(data));
                }
                console.log(`💀 Game over!  🏆 ${newHighscore ? 'New highscore' : 'Score'}: ${this._state.score}  🔁 Press ${Utils.isMac() ? '⌘' : '⌃'}R to play again.`);
            }, 0);
            return;
        }
        if (this._state.ball.aabb.maxY > Game._HEIGHT) {
            this._state.ball.aabb.center = [this._state.ball.aabb.center[0], Game._HEIGHT - this._state.ball.aabb.halfDimension[1]];
        }
    }

    render(dt: number): void {
        this._renderer.render(this._state);
    }

    private _generateFloor(y: number) {
        const hole = Game._HOLE_WIDTH + (Game._WIDTH - 2 * Game._HOLE_WIDTH) * Math.random();
        const l1 = (hole - Game._HOLE_WIDTH / 2) - 0;
        const l2 = Game._WIDTH - (hole + Game._HOLE_WIDTH / 2);
        return [new Platform(new AABB([l1 / 2, y], [l1 / 2, Game._FLOOR_HEIGHT / 2])), new Platform(new AABB([hole + Game._HOLE_WIDTH / 2 + l2 / 2, y], [l2 / 2, Game._FLOOR_HEIGHT / 2]))];
    }

}
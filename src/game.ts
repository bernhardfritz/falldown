import AbstractGame from "./abstract-game";
import Platform from "./platform";
import State from "./state";
import Renderer from "./renderer";
import ConsoleRenderer from "./console-renderer";
import StyledConsoleRenderer from "./styled-console-renderer";
import Constants from "./constants";
import Vec2 from "./vec2";

export default class Game extends AbstractGame {

    private readonly ROWS = 16;
    private readonly COLS = 8;
    state: State;
    private renderer: Renderer;
    private time: number;

    constructor() {
        super();
        this.state = new State();
        for (let y = 0; y < this.ROWS; y += 3) {
            const hole = Math.floor(1 + Math.random() * (this.COLS - 2));
            this.state.platforms.push(new Platform(0, hole - 1, y));
            this.state.platforms.push(new Platform(hole + 1, this.COLS - 1, y));
        }
        this.state.ball.r[1] = 2;
        // this.renderer = new ConsoleRenderer(this.ROWS, this.COLS);
        this.renderer = new StyledConsoleRenderer(this.ROWS, this.COLS);
    }
    
    loop(time: number): void {
        const dt = this.time !== undefined ? (time - this.time) / 1_000 : 0;
        this.time = time;
        this.update(dt);
        this.render();
    }

    update(dt: number): void {
        this.state.ball.v = Vec2.min(Vec2.add(this.state.ball.v, Vec2.scale(this.state.ball.a, dt)), Constants.VT);
        this.state.ball.r = Vec2.add(this.state.ball.r, this.state.ball.v);
        this.state.ball.r[0] = Math.max(0, Math.min(this.state.ball.r[0], this.COLS - 1));
        this.state.ball.r[1] = Math.min(this.state.ball.r[1], this.ROWS - 1);
        // TODO: collision detection
    }

    render(): void {
        this.renderer.render(this.state);
    }

}
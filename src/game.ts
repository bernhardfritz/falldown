import AbstractGame from "./abstract-game";
import Platform from "./platform";
import State from "./state";
import Renderer from "./renderer";
import ConsoleRenderer from "./console-renderer";
import StyledConsoleRenderer from "./styled-console-renderer";

export default class Game extends AbstractGame {

    private readonly ROWS = 16;
    private readonly COLS = 8;
    private state: State;
    private renderer: Renderer;

    constructor() {
        super();
        this.state = new State();
        for (let y = 0; y < this.ROWS; y += 3) {
            const hole = Math.floor(1 + Math.random() * (this.COLS - 2));
            this.state.platforms.push(new Platform(0, hole - 1, y));
            this.state.platforms.push(new Platform(hole + 1, this.COLS - 1, y));
        }
        this.state.ball.y = 2;
        // this.renderer = new ConsoleRenderer(this.ROWS, this.COLS);
        this.renderer = new StyledConsoleRenderer(this.ROWS, this.COLS);
    }
    
    loop(): void {
        this.renderer.render(this.state);
    }

}
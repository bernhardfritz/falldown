import Renderer from './renderer';
import State from './state';

export default class ConsoleRenderer implements Renderer {

    private static readonly UPPER_HALF_BLOCK = '\u2580'; // ▀
    private static readonly LOWER_HALF_BLOCK = '\u2584'; // ▄
    private static readonly FULL_BLOCK = '\u2588'; // █
    private static readonly SPACE = ' ';

    private readonly grid: boolean[][];

    constructor(readonly rows: number, readonly cols: number) {
        this.grid = (() => {
            let grid: Array<Array<boolean>> = new Array(this.rows);
            for (let row = 0; row < this.rows; row++) {
                grid[row] = new Array(this.cols).fill(false);
            }
            return grid;
        })();
    }

    render(state: State) {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                this.grid[row][col] = false;
            }
        }
        for (const platform of state.platforms) {
            for (let x = Math.min(platform.x1, platform.x2); x <= Math.max(platform.x1, platform.x2); x++) {
                this.grid[platform.y][x] = true;
            }
        }
        this.grid[state.ball.r[0]][state.ball.r[1]] = true;
        let out = '';
        for (let row = 0; row < this.rows - 1; row += 2) {
            let line = '';
            for (let col = 0; col < this.cols; col++) {
                line += this.grid[row][col] ? this.grid[row + 1][col] ? ConsoleRenderer.FULL_BLOCK : ConsoleRenderer.UPPER_HALF_BLOCK : this.grid[row + 1][col] ? ConsoleRenderer.LOWER_HALF_BLOCK : ConsoleRenderer.SPACE;
            }
            line += '\n';
            out += line;
        }
        console.log(out);
    }

}
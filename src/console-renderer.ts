import Renderer from './renderer';
import State from './state';
import Vec2, { vec2 } from './vec2';

export default class ConsoleRenderer implements Renderer {

    private static readonly UPPER_HALF_BLOCK = '\u2580'; // ▀
    private static readonly LOWER_HALF_BLOCK = '\u2584'; // ▄
    private static readonly FULL_BLOCK = '\u2588'; // █
    private static readonly SPACE = ' ';

    private readonly rows: number;
    private readonly cols: number;
    private readonly step: vec2;
    private readonly half_step: vec2;
    private readonly grid: boolean[][];
    private cachedOut: string = '';

    constructor(srcWidth: number, srcHeight: number, dstWidth: number, dstHeight: number) {
        this.rows = Math.floor(dstHeight);
        this.cols = Math.floor(dstWidth);
        this.step = [ srcWidth / dstWidth, srcHeight / dstHeight ];
        this.half_step = Vec2.scale(this.step, 0.5);
        this.grid = (() => {
            let grid: Array<Array<boolean>> = new Array(this.rows);
            for (let row = 0; row < this.rows; row++) {
                grid[row] = new Array(this.cols);
            }
            return grid;
        })();
    }

    render(state: State) {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const point: vec2 = Vec2.add(this.half_step, [col * this.step[0], row * this.step[1]]);
                if (state.ball.aabb.intersectsPoint(point)) {
                    this.grid[row][col] = true;
                    continue;
                }
                let cont = false;
                for (const platform of state.platforms) {
                    if (platform.aabb.intersectsPoint(point)) {
                        this.grid[row][col] = true;
                        cont = true;
                        break;
                    }
                }
                if (cont) {
                    continue;
                }
                this.grid[row][col] = false;
            }
        }
        let out = '';
        for (let row = 0; row < this.rows - 1; row += 2) {
            let line = '';
            for (let col = 0; col < this.cols; col++) {
                line += this.grid[row][col] ? this.grid[row + 1][col] ? ConsoleRenderer.FULL_BLOCK : ConsoleRenderer.UPPER_HALF_BLOCK : this.grid[row + 1][col] ? ConsoleRenderer.LOWER_HALF_BLOCK : ConsoleRenderer.SPACE;
            }
            line += '\n';
            out += line;
        }
        if (this.cachedOut === out) {
            return;
        }
        this.cachedOut = out;
        console.log(out);
    }

}
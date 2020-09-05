import Renderer from './renderer';
import State from './state';
import Vec2, { vec2 } from './vec2';

export default class ConsoleRenderer implements Renderer {

    private static readonly _UPPER_HALF_BLOCK = '\u2580'; // ▀
    private static readonly _LOWER_HALF_BLOCK = '\u2584'; // ▄
    private static readonly _FULL_BLOCK = '\u2588'; // █
    private static readonly _NEW_LINE = '\n';
    private static readonly _SPACE = ' ';

    private readonly _rows: number;
    private readonly _cols: number;
    private readonly _step: vec2;
    private readonly _half_step: vec2;
    private readonly _grid: boolean[][];
    private _cachedOut = '';

    constructor(srcWidth: number, srcHeight: number, dstWidth: number, dstHeight: number) {
        this._rows = Math.floor(dstHeight);
        this._cols = Math.floor(dstWidth);
        this._step = [ srcWidth / dstWidth, srcHeight / dstHeight ];
        this._half_step = Vec2.scale(this._step, 0.5);
        this._grid = (() => {
            const grid: Array<Array<boolean>> = new Array(this._rows);
            for (let row = 0; row < this._rows; row++) {
                grid[row] = new Array(this._cols);
            }
            return grid;
        })();
    }

    render(state: State): void {
        for (let row = 0; row < this._rows; row++) {
            const y = this._half_step[1] + row * this._step[1];
            for (let col = 0; col < this._cols; col++) {
                const x = this._half_step[0] + col * this._step[0];
                if (state.ball.aabb.containsPoint(x, y)) {
                    this._grid[row][col] = true;
                    continue;
                }
                if (state.platforms.collides({ minX: x, maxX: x, minY: y, maxY: y })) {
                    this._grid[row][col] = true;
                    continue;
                }
                this._grid[row][col] = false;
            }
        }
        let out = '';
        for (let row = 0; row < this._rows - 1; row += 2) {
            let line = '';
            for (let col = 0; col < this._cols; col++) {
                line += this._grid[row][col] ? this._grid[row + 1][col] ? ConsoleRenderer._FULL_BLOCK : ConsoleRenderer._UPPER_HALF_BLOCK : this._grid[row + 1][col] ? ConsoleRenderer._LOWER_HALF_BLOCK : ConsoleRenderer._SPACE;
            }
            line += ConsoleRenderer._NEW_LINE;
            out += line;
        }
        if (this._cachedOut === out) {
            return;
        }
        this._cachedOut = out;
        console.log(out);
    }

}
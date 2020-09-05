import Ball from './ball';
import Platform from './platform';
import Renderer from './renderer';
import State from './state';
import Utils from './utils';
import Vec2, { vec2 } from './vec2';

export default class StyledConsoleRenderer implements Renderer {

    private static readonly _BACKGROUND_COLOR = new Uint8ClampedArray([0, 0, 0]);
    private static readonly _CSS_SPECIFIER = '%c';
    private static readonly _NEW_LINE = '\n';
    private static readonly _SPACE = ' ';

    private readonly _rows: number;
    private readonly _cols: number;
    private readonly _step: vec2;
    private readonly _half_step: vec2;
    private readonly _data: Uint8ClampedArray;
    private _cachedOut = '';
    private _cachedStyles: string[] = [];

    constructor(srcWidth: number, srcHeight: number, dstWidth: number, dstHeight: number) {
        this._rows = Math.floor(dstHeight);
        this._cols = Math.floor(dstWidth);
        this._step = [ srcWidth / dstWidth, srcHeight / dstHeight ];
        this._half_step = Vec2.scale(this._step, 0.5);
        this._data = new Uint8ClampedArray(this._rows * this._cols * 3);
    }

    render(state: State): void {
        for (let row = 0; row < this._rows; row++) {
            const y = this._half_step[1] + row * this._step[1];
            for (let col = 0; col < this._cols; col++) {
                const x = this._half_step[0] + col * this._step[0];
                if (state.ball.aabb.containsPoint(x, y)) {
                    this._data[row * this._cols * 3 + col * 3 + 0] = Ball.COLOR[0];
                    this._data[row * this._cols * 3 + col * 3 + 1] = Ball.COLOR[1];
                    this._data[row * this._cols * 3 + col * 3 + 2] = Ball.COLOR[2];
                    continue;
                }
                if (state.platforms.collides({ minX: x, maxX: x, minY: y, maxY: y })) {
                    this._data[row * this._cols * 3 + col * 3 + 0] = Platform.COLOR[0];
                    this._data[row * this._cols * 3 + col * 3 + 1] = Platform.COLOR[1];
                    this._data[row * this._cols * 3 + col * 3 + 2] = Platform.COLOR[2];
                    continue;
                }
                this._data[row * this._cols * 3 + col * 3 + 0] = StyledConsoleRenderer._BACKGROUND_COLOR[0];
                this._data[row * this._cols * 3 + col * 3 + 1] = StyledConsoleRenderer._BACKGROUND_COLOR[1];
                this._data[row * this._cols * 3 + col * 3 + 2] = StyledConsoleRenderer._BACKGROUND_COLOR[2];
            }
        }
        let out = '';
        const styles: string[] = [];
        for (let row = 0; row < this._rows - 1; row += 2) {
            let line = '';
            for (let col = 0; col < this._cols; col++) {
                const from = `rgb(${this._data[row * this._cols * 3 + col * 3 + 0]},${this._data[row * this._cols * 3 + col * 3 + 1]},${this._data[row * this._cols * 3 + col * 3 + 2]})`;
                const to = `rgb(${this._data[(row + 1) * this._cols * 3 + col * 3 + 0]},${this._data[(row + 1) * this._cols * 3 + col * 3 + 1]},${this._data[(row + 1) * this._cols * 3 + col * 3 + 2]})`;
                const style = `background:linear-gradient(${from}, ${from} 50%, ${to} 50%, ${to})`;
                if (styles.length === 0 || styles[styles.length - 1] !== style) {
                    styles.push(style);
                    line += StyledConsoleRenderer._CSS_SPECIFIER;
                }
                line += StyledConsoleRenderer._SPACE;
            }
            line += StyledConsoleRenderer._NEW_LINE;
            out += line;
        }

        // style reset
        out += StyledConsoleRenderer._CSS_SPECIFIER;
        styles.push('');

        if (this._cachedOut === out) {
            if (Utils.isEqual(this._cachedStyles, styles)) {
                return;
            }
            this._cachedStyles = styles;
            out += StyledConsoleRenderer._SPACE; // add space if console.log only differs by style in order to prevent browser from showing duplicate log index
        }
        this._cachedOut = out;

        console.log(out, ...styles);
    }

}
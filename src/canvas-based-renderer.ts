import CanvasRenderer from "./canvas-renderer";
import State from "./state";
import Utils from "./utils";
import Vec2, { vec2 } from "./vec2";

export default class CanvasBasedConsoleRenderer extends CanvasRenderer {

    private static readonly _CSS_SPECIFIER = '%c';
    private static readonly _NEW_LINE = '\n';
    private static readonly _SPACE = ' ';

    private readonly _step: vec2;
    private readonly _half_step: vec2;
    private readonly _data: Uint8ClampedArray;
    private _cachedOut = '';
    private _cachedStyles: string[] = [];

    constructor(canvas: HTMLCanvasElement, private readonly _cols: number, private readonly _rows: number) {
        super(canvas);
        this._step = [ canvas.width / _cols, canvas.height / _rows ];
        this._half_step = Vec2.scale(this._step, 0.5);
        this._data = new Uint8ClampedArray(_rows * _cols * 3);
    }

    render(state: State): void {
        super.render(state);
        const imageData = this.ctx.getImageData(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        for (let row = 0; row < this._rows; row++) {
            const y = Math.floor(this._half_step[1] + row * this._step[1]);
            for (let col = 0; col < this._cols; col++) {
                const x = Math.floor(this._half_step[0] + col * this._step[0]);
                this._data[row * this._cols * 3 + col * 3 + 0] = imageData.data[y * this.ctx.canvas.width * 4 + x * 4 + 0];
                this._data[row * this._cols * 3 + col * 3 + 1] = imageData.data[y * this.ctx.canvas.width * 4 + x * 4 + 1];
                this._data[row * this._cols * 3 + col * 3 + 2] = imageData.data[y * this.ctx.canvas.width * 4 + x * 4 + 2];
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
                    line += CanvasBasedConsoleRenderer._CSS_SPECIFIER;
                }
                line += CanvasBasedConsoleRenderer._SPACE;
            }
            line += CanvasBasedConsoleRenderer._NEW_LINE;
            out += line;
        }

        // style reset
        out += CanvasBasedConsoleRenderer._CSS_SPECIFIER;
        styles.push('');

        if (this._cachedOut === out) {
            if (Utils.isEqual(this._cachedStyles, styles)) {
                return;
            }
            this._cachedStyles = styles;
            out += CanvasBasedConsoleRenderer._SPACE; // add space if console.log only differs by style in order to prevent browser from showing duplicate log index
        }
        this._cachedOut = out;

        console.log(out, ...styles);
    }

}
import CanvasRenderer from "./canvas-renderer";
import State from "./state";
import Utils from "./utils";
import Vec2, { vec2 } from "./vec2";

export default class CanvasBasedConsoleRenderer extends CanvasRenderer {

    private static readonly CSS_SPECIFIER = '%c';
    private static readonly NEW_LINE = '\n';
    private static readonly SPACE = ' ';

    private readonly step: vec2;
    private readonly half_step: vec2;
    private readonly data: Uint8ClampedArray;
    private cachedOut = '';
    private cachedStyles: string[] = [];

    constructor(canvas: HTMLCanvasElement, private readonly cols: number, private readonly rows: number) {
        super(canvas);
        this.step = [ canvas.width / cols, canvas.height / rows ];
        this.half_step = Vec2.scale(this.step, 0.5);
        this.data = new Uint8ClampedArray(rows * cols * 3);
    }

    render(state: State): void {
        super.render(state);
        const imageData = this.ctx.getImageData(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        for (let row = 0; row < this.rows; row++) {
            const y = Math.floor(this.half_step[1] + row * this.step[1]);
            for (let col = 0; col < this.cols; col++) {
                const x = Math.floor(this.half_step[0] + col * this.step[0]);
                this.data[row * this.cols * 3 + col * 3 + 0] = imageData.data[y * this.ctx.canvas.width * 4 + x * 4 + 0];
                this.data[row * this.cols * 3 + col * 3 + 1] = imageData.data[y * this.ctx.canvas.width * 4 + x * 4 + 1];
                this.data[row * this.cols * 3 + col * 3 + 2] = imageData.data[y * this.ctx.canvas.width * 4 + x * 4 + 2];
            }
        }
        let out = '';
        const styles: string[] = [];
        for (let row = 0; row < this.rows - 1; row += 2) {
            let line = '';
            for (let col = 0; col < this.cols; col++) {
                const from = `rgb(${this.data[row * this.cols * 3 + col * 3 + 0]},${this.data[row * this.cols * 3 + col * 3 + 1]},${this.data[row * this.cols * 3 + col * 3 + 2]})`;
                const to = `rgb(${this.data[(row + 1) * this.cols * 3 + col * 3 + 0]},${this.data[(row + 1) * this.cols * 3 + col * 3 + 1]},${this.data[(row + 1) * this.cols * 3 + col * 3 + 2]})`;
                const style = `background:linear-gradient(${from}, ${from} 50%, ${to} 50%, ${to})`;
                if (styles.length === 0 || styles[styles.length - 1] !== style) {
                    styles.push(style);
                    line += CanvasBasedConsoleRenderer.CSS_SPECIFIER;
                }
                line += CanvasBasedConsoleRenderer.SPACE;
            }
            line += CanvasBasedConsoleRenderer.NEW_LINE;
            out += line;
        }

        // style reset
        out += CanvasBasedConsoleRenderer.CSS_SPECIFIER;
        styles.push('');

        if (this.cachedOut === out) {
            if (Utils.isEqual(this.cachedStyles, styles)) {
                return;
            }
            this.cachedStyles = styles;
            out += CanvasBasedConsoleRenderer.SPACE; // add space if console.log only differs by style in order to prevent browser from showing duplicate log index
        }
        this.cachedOut = out;

        console.log(out, ...styles);
    }

}
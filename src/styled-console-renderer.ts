import Ball from './ball';
import Platform from './platform';
import Renderer from './renderer';
import State from './state';
import Utils from './utils';
import Vec2, { vec2 } from './vec2';

export default class StyledConsoleRenderer implements Renderer {

    private static readonly BACKGROUND_COLOR = new Uint8ClampedArray([0, 0, 0]);
    private static readonly CSS_SPECIFIER = '%c';
    private static readonly NEW_LINE = '\n';
    private static readonly SPACE = ' ';

    private readonly rows: number;
    private readonly cols: number;
    private readonly step: vec2;
    private readonly half_step: vec2;
    private readonly data: Uint8ClampedArray;
    private cachedOut = '';
    private cachedStyles: string[] = [];

    constructor(srcWidth: number, srcHeight: number, dstWidth: number, dstHeight: number) {
        this.rows = Math.floor(dstHeight);
        this.cols = Math.floor(dstWidth);
        this.step = [ srcWidth / dstWidth, srcHeight / dstHeight ];
        this.half_step = Vec2.scale(this.step, 0.5);
        this.data = new Uint8ClampedArray(this.rows * this.cols * 3);
    }

    render(state: State): void {
        for (let row = 0; row < this.rows; row++) {
            const y = this.half_step[1] + row * this.step[1];
            for (let col = 0; col < this.cols; col++) {
                const x = this.half_step[0] + col * this.step[0];
                if (state.ball.aabb.containsPoint(x, y)) {
                    this.data[row * this.cols * 3 + col * 3 + 0] = Ball.COLOR[0];
                    this.data[row * this.cols * 3 + col * 3 + 1] = Ball.COLOR[1];
                    this.data[row * this.cols * 3 + col * 3 + 2] = Ball.COLOR[2];
                    continue;
                }
                if (state.platforms.collides({ minX: x, maxX: x, minY: y, maxY: y })) {
                    this.data[row * this.cols * 3 + col * 3 + 0] = Platform.COLOR[0];
                    this.data[row * this.cols * 3 + col * 3 + 1] = Platform.COLOR[1];
                    this.data[row * this.cols * 3 + col * 3 + 2] = Platform.COLOR[2];
                    continue;
                }
                this.data[row * this.cols * 3 + col * 3 + 0] = StyledConsoleRenderer.BACKGROUND_COLOR[0];
                this.data[row * this.cols * 3 + col * 3 + 1] = StyledConsoleRenderer.BACKGROUND_COLOR[1];
                this.data[row * this.cols * 3 + col * 3 + 2] = StyledConsoleRenderer.BACKGROUND_COLOR[2];
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
                    line += StyledConsoleRenderer.CSS_SPECIFIER;
                }
                line += StyledConsoleRenderer.SPACE;
            }
            line += StyledConsoleRenderer.NEW_LINE;
            out += line;
        }

        // style reset
        out += StyledConsoleRenderer.CSS_SPECIFIER;
        styles.push('');

        if (this.cachedOut === out) {
            if (Utils.isEqual(this.cachedStyles, styles)) {
                return;
            }
            this.cachedStyles = styles;
            out += StyledConsoleRenderer.SPACE; // add space if console.log only differs by style in order to prevent browser from showing duplicate log index
        }
        this.cachedOut = out;

        console.log(out, ...styles);
    }

}
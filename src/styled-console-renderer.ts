import Renderer from './renderer';
import State from './state';
import StyleBuilder from './style-builder';
import Utils from './utils';
import Vec2, { vec2 } from './vec2';

export default class StyledConsoleRenderer implements Renderer {

    private static readonly SPACE = ' ';
    private static readonly CSS_SPECIFIER = '%c';
    private static readonly BLACK_BLACK = new StyleBuilder().bg('#000').build();
    private static readonly BLACK_GREEN = new StyleBuilder().bg('linear-gradient(#000, #000 50%, #0f0 50%, #0f0)').build();
    private static readonly BLACK_RED = new StyleBuilder().bg('linear-gradient(#000, #000 50%, #f00 50%, #f00)').build();
    private static readonly GREEN_GREEN = new StyleBuilder().bg('#0f0').build();
    private static readonly GREEN_BLACK = new StyleBuilder().bg('linear-gradient(#0f0, #0f0 50%, #000 50%, #000)').build();
    private static readonly GREEN_RED = new StyleBuilder().bg('linear-gradient(#0f0, #0f0 50%, #f00 50%, #f00)').build();
    private static readonly RED_RED = new StyleBuilder().bg('#f00').build();
    private static readonly RED_BLACK = new StyleBuilder().bg('linear-gradient(#f00, #f00 50%, #000 50%, #000)').build();
    private static readonly RED_GREEN = new StyleBuilder().bg('linear-gradient(#f00, #f00 50%, #0f0 50%, #0f0)').build();
    private static readonly MAP: Map<string, string> = (() => {
        let map: Map<string, string> = new Map();
        map.set('bb', StyledConsoleRenderer.BLACK_BLACK);
        map.set('bg', StyledConsoleRenderer.BLACK_GREEN);
        map.set('br', StyledConsoleRenderer.BLACK_RED);
        map.set('gg', StyledConsoleRenderer.GREEN_GREEN);
        map.set('gb', StyledConsoleRenderer.GREEN_BLACK);
        map.set('gr', StyledConsoleRenderer.GREEN_RED);
        map.set('rr', StyledConsoleRenderer.RED_RED);
        map.set('rb', StyledConsoleRenderer.RED_BLACK);
        map.set('rg', StyledConsoleRenderer.RED_GREEN);
        return map;
    })();

    private readonly rows: number;
    private readonly cols: number;
    private readonly step: vec2;
    private readonly half_step: vec2;
    private readonly grid: string[][];
    private cachedOut: string = '';
    private cachedStyles: string[] = [];

    constructor(srcWidth: number, srcHeight: number, dstWidth: number, dstHeight: number) {
        this.rows = Math.floor(dstHeight);
        this.cols = Math.floor(dstWidth);
        this.step = [ srcWidth / dstWidth, srcHeight / dstHeight ];
        this.half_step = Vec2.scale(this.step, 0.5);
        this.grid = (() => {
            let grid: Array<Array<string>> = new Array(this.rows);
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
                    this.grid[row][col] = 'r';
                    continue;
                }
                let cont = false;
                for (const platform of state.platforms) {
                    if (platform.aabb.intersectsPoint(point)) {
                        this.grid[row][col] = 'g';
                        cont = true;
                        break;
                    }
                }
                if (cont) {
                    continue;
                }
                this.grid[row][col] = 'b';
            }
        }
        let out = '';
        let styles: string[] = [];
        for (let row = 0; row < this.rows - 1; row += 2) {
            let line = '';
            for (let col = 0; col < this.cols; col++) {
                let style = this.grid[row][col] + this.grid[row + 1][col];
                if (styles.length === 0 || styles[styles.length - 1] !== style) {
                    styles.push(style);
                    line += StyledConsoleRenderer.CSS_SPECIFIER;
                }
                line += StyledConsoleRenderer.SPACE;
            }
            line += '\n';
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
        console.log(out, ...styles.map(style => StyledConsoleRenderer.MAP.get(style) || style));
    }

}
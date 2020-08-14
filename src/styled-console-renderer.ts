import Renderer from './renderer';
import State from './state';
import StyleBuilder from './style-builder';

export default class StyledConsoleRenderer implements Renderer {

    private static readonly SPACE = ' ';
    private static readonly BLACK_BLACK = new StyleBuilder().bg('#000').build();
    private static readonly BLACK_GREEN = new StyleBuilder().bg('linear-gradient(#000, #000 50%, #0f0 50%, #0f0)').build();
    private static readonly BLACK_RED = new StyleBuilder().bg('linear-gradient(#000, #000 50%, #f00 50%, #f00)').build();
    private static readonly GREEN_GREEN = new StyleBuilder().bg('#0f0').build();
    private static readonly GREEN_BLACK = new StyleBuilder().bg('linear-gradient(#0f0, #0f0 50%, #000 50%, #000)').build();
    private static readonly GREEN_RED = new StyleBuilder().bg('linear-gradient(#0f0, #0f0 50%, #f00 50%, #f00)').build();
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
        map.set('rb', StyledConsoleRenderer.RED_BLACK);
        map.set('rg', StyledConsoleRenderer.RED_GREEN);
        return map;
    })();

    private readonly grid: string[][];

    constructor(readonly rows: number, readonly cols: number) {
        this.grid = (() => {
            let grid: Array<Array<string>> = new Array(this.rows);
            for (let row = 0; row < this.rows; row++) {
                grid[row] = new Array(this.cols).fill('b');
            }
            return grid;
        })();
    }

    render(state: State) {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                this.grid[row][col] = 'b';
            }
        }
        for (const platform of state.platforms) {
            for (let x = Math.min(platform.x1, platform.x2); x <= Math.max(platform.x1, platform.x2); x++) {
                this.grid[platform.y][x] = 'g';
            }
        }
        this.grid[state.ball.y][state.ball.x] = 'r';
        let out = '';
        let styles: string[] = [];
        for (let row = 0; row < this.rows - 1; row += 2) {
            let line = '';
            for (let col = 0; col < this.cols; col++) {
                let style = this.grid[row][col] + this.grid[row + 1][col];
                if (styles.length === 0 || styles[styles.length - 1] !== style) {
                    styles.push(style);
                    line += '%c';
                }
                line += StyledConsoleRenderer.SPACE;
            }
            line += '\n';
            out += line;
        }
        console.log(out, ...styles.map(style => StyledConsoleRenderer.MAP.get(style)));
    }

}
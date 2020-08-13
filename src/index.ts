import Ball from './ball';

const COLOR_FACTORY = (color: String) => `color: ${color};`;
const RED = COLOR_FACTORY('#f00');
const GREEN = COLOR_FACTORY('#0f0');
const UPPER_HALF_BLOCK = '\u2580'; // ▀
const LOWER_HALF_BLOCK = '\u2584'; // ▄
const SPACE = ' ';
const ROWS = 8;
const COLUMNS = 8;
const PLATFORMS_FACTORY = () => {
    let platforms: Array<Array<boolean>> = new Array(ROWS);
    for (let row = 0; row < ROWS; row++) {
        platforms[row] = new Array(COLUMNS).fill(false);
    }
    return platforms;
};
const PLATFORMS = PLATFORMS_FACTORY();
const BALL = new Ball(4, 4);

for (let row = 0; row < ROWS; row++) {
    for (let column = 0; column < COLUMNS; column++) {
        PLATFORMS[row][column] = Math.random() < 0.9;
    }
}

let out = '%c';
for (let row = 0; row < ROWS; row++) {
    for (let column = 0; column < COLUMNS; column++) {
        out += PLATFORMS[row][column] ? UPPER_HALF_BLOCK : SPACE;
    }
    out += '\n';
    for (let column = 0; column < COLUMNS; column++) {
        out += row === BALL.y && column === BALL.x ? `%c${LOWER_HALF_BLOCK}%c` : SPACE;
    }
    if (row < ROWS - 1) {
        out += '\n';
    }
}

console.log(`${out}`, GREEN, RED, GREEN);
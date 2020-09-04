import Constants from './constants';
import Game from './game';

const game = new Game();
game.targetFps = 24;
game.start();

document.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') {
        game.state.ball.v[0] = -Constants.VX;
    } else if (event.key === 'ArrowRight') {
        game.state.ball.v[0] = Constants.VX;
    } else if (event.key === 'Escape') {
        if (game.isRunning()) {
            game.stop();
        } else {
            game.start();
        }
    }
});

document.addEventListener('keyup', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        game.state.ball.v[0] = 0;
    }
});
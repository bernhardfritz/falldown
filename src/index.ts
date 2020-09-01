import Game from './game';
import Constants from './constants';

const game = new Game();
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
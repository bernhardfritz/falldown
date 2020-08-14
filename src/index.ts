import Game from './game';

const game = new Game();
game.start();

document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
        if (game.isRunning()) {
            game.stop();
        } else {
            game.start();
        }
    }
});
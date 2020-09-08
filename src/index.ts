import Constants from './constants';
import Game from './game';
import Utils from './utils';
import './assets/style.css';

(() => {
    if (Utils.isMac()) {
        document.getElementById('key1').textContent = '⌥';
        document.getElementById('key2').textContent = '⌘';
    }
    if (navigator.userAgent.indexOf('Chrome') === -1) {
        if (navigator.userAgent.indexOf('Firefox') !== -1) {
            document.getElementById('key3').textContent = 'K';
        } else if (navigator.userAgent.indexOf('Safari') !== -1) {
            document.getElementById('key3').textContent = 'C';
        }
    }
    
    const game = new Game();
    game.fps = 24;
    game.start();
    
    document.addEventListener('keydown', event => {
        if (event.key === 'ArrowLeft') {
            game.state.ball.v[0] = -Constants.VX;
        } else if (event.key === 'ArrowRight') {
            game.state.ball.v[0] = Constants.VX;
        }
    });
    
    document.addEventListener('keyup', event => {
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
            game.state.ball.v[0] = 0;
        }
    });
    
    window.addEventListener('blur', event => {
        if (game.state.gameover || !game.isRunning()) {
            return;
        }
        game.stop();
        console.log('⏸ Paused. Click anywhere on the page to resume.')
    });
    
    document.addEventListener('click', event => {
        if (game.state.gameover || game.isRunning()) {
            return;
        }
        game.start();
    });
})();
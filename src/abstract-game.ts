export default abstract class AbstractGame {

    private handle = 0;

    start() {
        if (!this.isRunning()) {
            this.handle = window.requestAnimationFrame(this._loop);
        }
    }
    
    abstract loop(): void;

    private _loop = () => {
        this.loop();
        this.handle = window.requestAnimationFrame(this._loop);
    }

    stop() {
        window.cancelAnimationFrame(this.handle);
        this.handle = 0;
    }

    isRunning(): boolean {
        return this.handle !== 0;
    }

}
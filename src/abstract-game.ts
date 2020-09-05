export default abstract class AbstractGame {

    private _frametime: number | undefined = undefined;
    private _handle = 0;
    protected time = 0;

    set fps(fps: number) {
        this._frametime = 1000 / fps;
    }

    start(): void {
        if (!this.isRunning()) {
            this._handle = window.requestAnimationFrame(this._loop);
        }
    }
    
    abstract loop(dt: number): void;

    private _loop = (time: number) => {
        this._handle = window.requestAnimationFrame(this._loop);
        const dt = time - this.time;
        if (this._frametime !== undefined) {
            if (dt > this._frametime) {
                this.time = time - (dt % this._frametime);
                this.loop(dt);
            }
        } else {
            this.time = time;
            this.loop(dt);
        }
    }

    stop(): void {
        window.cancelAnimationFrame(this._handle);
        this._handle = 0;
    }

    isRunning(): boolean {
        return this._handle !== 0;
    }

}
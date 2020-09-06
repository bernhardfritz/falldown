export default abstract class AbstractGame {

    private _frametime: number | undefined = undefined;
    private _handle = 0;
    private _updateTimestamp = 0;
    private _renderTimestamp = 0;
    private _pauseTimestamp = Date.now();

    set fps(fps: number) {
        this._frametime = 1000 / fps;
    }

    start(): void {
        if (!this.isRunning()) {
            const pauseDuration = Date.now() - this._pauseTimestamp;
            this._updateTimestamp += pauseDuration;
            this._renderTimestamp += pauseDuration;
            this._handle = window.requestAnimationFrame(this._loop);
        }
    }
    
    abstract update(dt: number): void;

    abstract render(dt: number): void;

    private _loop = (time: number) => {
        this._handle = window.requestAnimationFrame(this._loop);
        
        const dtUpdate = time - this._updateTimestamp;
        this._updateTimestamp = time;
        this.update(dtUpdate);

        const dtRender = time - this._renderTimestamp;
        if (this._frametime !== undefined) {
            if (dtRender > this._frametime) {
                this._renderTimestamp = time - (dtRender % this._frametime);
                this.render(dtRender);
            }
        } else {
            this._renderTimestamp = time;
            this.render(dtRender);
        }
    }

    stop(): void {
        window.cancelAnimationFrame(this._handle);
        this._handle = 0;
        this._pauseTimestamp = Date.now();
    }

    isRunning(): boolean {
        return this._handle !== 0;
    }

}
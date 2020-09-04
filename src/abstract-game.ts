export default abstract class AbstractGame {

    private targetFrametime: number | undefined = undefined;
    private handle = 0;
    protected time = 0;

    set targetFps(targetFps: number) {
        this.targetFrametime = 1000 / targetFps;
    }

    start(): void {
        if (!this.isRunning()) {
            this.handle = window.requestAnimationFrame(this._loop);
        }
    }
    
    abstract loop(dt: number): void;

    private _loop = (time: number) => {
        this.handle = window.requestAnimationFrame(this._loop);
        const dt = time - this.time;
        if (this.targetFrametime !== undefined) {
            if (dt > this.targetFrametime) {
                this.time = time - (dt % this.targetFrametime);
                this.loop(dt);
            }
        } else {
            this.time = time;
            this.loop(dt);
        }
    }

    stop(): void {
        window.cancelAnimationFrame(this.handle);
        this.handle = 0;
    }

    isRunning(): boolean {
        return this.handle !== 0;
    }

}
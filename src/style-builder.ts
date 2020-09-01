export default class StyleBuilder {

    private _fg: string | undefined;
    private _bg: string | undefined;

    fg(fg: string): StyleBuilder {
        this._fg = fg;
        return this;
    }

    bg(bg: string): StyleBuilder {
        this._bg = bg;
        return this;
    }

    build(): string {
        const styles = [];
        if (this._fg !== undefined) {
            styles.push(`color: ${this._fg};`);
        }
        if (this._bg !== undefined) {
            styles.push(`background: ${this._bg};`);
        }
        return styles.join(' ');
    }

}
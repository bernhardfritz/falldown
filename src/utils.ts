export default class Utils {

    private constructor() {}

    static isEqual<T>(a: ReadonlyArray<T>, b: ReadonlyArray<T>): boolean {
        if (a === b) {
            return true;
        }
        if (a.length !== b.length) {
            return false;
        }
        for (let i = 0; i < a.length; i++) {
            if (a[i] !== b[i]) {
                return false;
            }
        }
        return true;
    }

    static isMac(): boolean {
        return navigator.platform.indexOf('Mac') !== -1;
    }
    
}
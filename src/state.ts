import AABB from './aabb';
import Ball from './ball';
import MyRBush from './my-rbush';

export default class State {

    private readonly _platforms: MyRBush = new MyRBush();
    private readonly _ball = new Ball(new AABB([0, 0], [0, 0]));

    get platforms(): MyRBush {
        return this._platforms;
    }

    get ball(): Ball {
        return this._ball;
    }

}
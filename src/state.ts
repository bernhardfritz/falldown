import AABB from './aabb';
import Ball from './ball';
import MyRBush from './my-rbush';

export default class State {

    public readonly platforms: MyRBush = new MyRBush();
    public readonly ball = new Ball(new AABB([0, 0], [0, 0]));

}
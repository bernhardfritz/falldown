import AABB from './aabb';
import Ball from './ball';
import Platform from './platform';

export default class State {

    public readonly platforms: Platform[] = [];
    public readonly ball = new Ball(new AABB([0, 0], [0, 0]));

}
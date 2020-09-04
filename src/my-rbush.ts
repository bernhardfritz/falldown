import RBush, { BBox } from "rbush"
import HasAABB from "./has-aabb";

export default class MyRBush extends RBush<HasAABB> {

    toBBox(hasAABB: HasAABB): BBox {
        return hasAABB.aabb;
    }

}
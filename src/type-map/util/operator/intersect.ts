import {TypeMap} from "../../type-map";
import {UnionToIntersection, Merge} from "../../../type-util";

/**
 * Assumes `U` is a union
 */
export type Intersect<
    U extends TypeMap
> = (
    Merge<UnionToIntersection<U>>
);

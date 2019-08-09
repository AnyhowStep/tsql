import {TypeMap} from "../../type-map";
import {UnionToIntersection} from "../../../type-util";

/**
 * Assumes `U` is a union
 */
export type Intersect<
    U extends TypeMap
> = (
    Extract<UnionToIntersection<U>, TypeMap>
);

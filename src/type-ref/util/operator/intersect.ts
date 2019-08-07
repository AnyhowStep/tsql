import {TypeRef} from "../../type-ref";
import {UnionToIntersection} from "../../../type-util";
import {TypeMapUtil} from "../../../type-map";

/**
 * Assumes `U` is a union
 */
export type Intersect<
    U extends TypeRef
> = (
    {
        readonly [tableAlias in keyof UnionToIntersection<U>] : (
            TypeMapUtil.Intersect<Extract<U, { [k in tableAlias] : any }>[tableAlias]>
        )
    }
);

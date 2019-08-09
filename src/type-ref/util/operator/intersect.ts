import {TypeRef} from "../../type-ref";
import {UnionToIntersection} from "../../../type-util";
import {TypeMapUtil} from "../../../type-map";
import {ExtractTypeMap} from "../query";

/**
 * Assumes `U` is a union
 */
export type Intersect<
    U extends TypeRef
> = (
    {
        readonly [tableAlias in Extract<keyof UnionToIntersection<U>, string>] : (
            TypeMapUtil.Intersect<
                ExtractTypeMap<U, tableAlias>
            >
        )
    }
);

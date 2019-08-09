import {TypeRef} from "../../type-ref";
import {TypeMapUtil} from "../../../type-map";
import {ExtractTypeMap} from "../query";

type K<U extends TypeRef> = (
    U extends TypeRef ?
    keyof U :
    never
);
/**
 * Assumes `U` is a union
 */
export type Intersect<
    U extends TypeRef
> = (
    {
        readonly [tableAlias in Extract<K<U>, string>] : (
            TypeMapUtil.Intersect<
                ExtractTypeMap<U, tableAlias>
            >
        )
    }
);

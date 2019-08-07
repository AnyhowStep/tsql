import {AnyRawExpr} from "../../raw-expr";
import {UsedRef, usedRef} from "../query";
import {UsedRefUtil} from "../../../used-ref";

/**
 * Assumes `U` is a union
 */
export type IntersectUsedRef<
    U extends AnyRawExpr
> = (
    UsedRefUtil.Intersect<UsedRef<U>>
);

export function intersectUsedRef<
    ArrT extends readonly AnyRawExpr[]
> (
    ...arr : ArrT
) : (
    IntersectUsedRef<ArrT[number]>
) {
    const result : IntersectUsedRef<ArrT[number]> = UsedRefUtil.intersect(...arr.map(
        u => usedRef<ArrT[number]>(u)
    ));
    return result;
}

import {AnyRawExpr} from "../../raw-expr";
import {usedRef, UsedRef} from "../query";
import {UsedRefUtil} from "../../../used-ref";



/**
 * Assumes `U` is a union
 *
 * @todo Seems to only allow chaining 16 times.
 * @todo Find a way to increase the limit to 60 or more
 * Seems impossible.
 */
export type IntersectUsedRef<
    U extends AnyRawExpr
> =
    UsedRefUtil.Intersect<
        UsedRef<U>
    >
;

export function intersectUsedRef<
    ArrT extends readonly AnyRawExpr[]
> (
    ...arr : ArrT
) : (
    IntersectUsedRef<ArrT[number]>
) {
    const result : IntersectUsedRef<ArrT[number]> = UsedRefUtil.intersect(...arr.map(
        u => usedRef<ArrT[number]>(u)
    )) as IntersectUsedRef<ArrT[number]>;
    return result;
}

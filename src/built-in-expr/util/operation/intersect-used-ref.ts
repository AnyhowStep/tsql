import {AnyBuiltInExpr} from "../../built-in-expr";
import {usedRef, UsedRef} from "../query";
import {UsedRefUtil} from "../../../used-ref";
import {IQueryBase} from "../../../query-base";
import {TryReuseExistingType} from "../../../type-util";
import {IExpr} from "../../../expr";
import {IExprSelectItem} from "../../../expr-select-item";



/**
 * Assumes `U` is a union
 *
 * @todo Seems to only allow chaining 16 times.
 * @todo Find a way to increase the limit to 60 or more
 * Seems impossible.
 */
export type IntersectUsedRef<
    U extends AnyBuiltInExpr|IQueryBase
> =
    TryReuseExistingType<
        Extract<U, IExpr|IExprSelectItem>["usedRef"],
        UsedRefUtil.Intersect<
            UsedRef<U>
        >
    >
;

export function intersectUsedRef<
    ArrT extends readonly (AnyBuiltInExpr|IQueryBase)[]
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

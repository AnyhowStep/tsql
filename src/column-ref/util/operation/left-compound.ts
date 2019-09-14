import {ColumnRef, WritableColumnRef} from "../../column-ref";
import {ColumnMapUtil} from "../../../column-map";

/**
 * Like `LeftIntersect`, but the type of columns is unioned,
 * not intersected.
 *
 * This is used to implement `CompoundQueryClauseUtil.compoundQuery()`
 *
 * @todo Better name?
 */
export type LeftCompound<
    RefA extends ColumnRef,
    RefB extends ColumnRef
> = (
    {
        readonly [tableAlias in Extract<keyof RefA, string>] : (
            tableAlias extends keyof RefB ?
            ColumnMapUtil.Compound<
                RefA[tableAlias],
                RefB[tableAlias]
            > :
            RefA[tableAlias]
        )
    }
);
export function leftCompound<
    RefA extends ColumnRef,
    RefB extends ColumnRef
>(
    refA : RefA,
    refB : RefB
) : (
    LeftCompound<RefA, RefB>
) {
    const result : WritableColumnRef = {};
    for (const tableAlias of Object.keys(refA)) {
        if (
            Object.prototype.hasOwnProperty.call(refB, tableAlias) &&
            Object.prototype.propertyIsEnumerable.call(refB, tableAlias)
        ) {
            result[tableAlias] = ColumnMapUtil.compound(
                refA[tableAlias],
                refB[tableAlias]
            );
        } else {
            result[tableAlias] = refA[tableAlias];
        }
    }
    return result as LeftCompound<RefA, RefB>;
}

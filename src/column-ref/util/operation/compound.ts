import {ColumnRef, WritableColumnRef} from "../../column-ref";
import {LeftCompound, leftCompound} from "./left-compound";
import {Merge} from "../../../type-util";

/**
 * Like `Intersect`, but the type of columns is unioned,
 * not intersected.
 *
 * This is used to implement `CompoundQueryClauseUtil.compoundQuery()`
 *
 * @todo Better name?
 */
export type Compound<
    RefA extends ColumnRef,
    RefB extends ColumnRef
> = (
    Merge<
        & LeftCompound<RefA, RefB>
        & {
            readonly [tableAlias in Exclude<
                Extract<keyof RefB, string>,
                keyof RefA
            >] : (
                RefB[tableAlias]
            )
        }
    >
);
export function compound<
    RefA extends ColumnRef,
    RefB extends ColumnRef
> (
    refA : RefA,
    refB : RefB
) : Compound<RefA, RefB> {
    const left : LeftCompound<
        RefA, RefB
    > = leftCompound(refA, refB);

    const right : WritableColumnRef = {};
    for (const tableAlias of Object.keys(refB)) {
        if (
            Object.prototype.hasOwnProperty.call(refA, tableAlias) &&
            Object.prototype.propertyIsEnumerable.call(refA, tableAlias)
        ) {
            continue;
        }
        right[tableAlias] = refB[tableAlias];
    }
    return {
        ...left,
        ...right,
    } as ColumnRef as Compound<RefA, RefB>;
}

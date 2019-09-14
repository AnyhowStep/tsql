import * as tm from "type-mapping";
import {SelectClause} from "../../select-clause";
import {IColumn, ColumnUtil} from "../../../column";
import {IExprSelectItem, ExprSelectItemUtil} from "../../../expr-select-item";
import {ColumnMap, ColumnMapUtil} from "../../../column-map";
import {ColumnRef, ColumnRefUtil} from "../../../column-ref";
import {SelectItem} from "../../../select-item";

/**
 * The type of columns is unioned, not intersected.
 *
 * This is used to implement `CompoundQueryClauseUtil.compoundQuery()`
 *
 * @todo Better name?
 */
export type LeftCompoundImpl<
    A extends SelectClause,
    B extends SelectClause
> =
    {
        [index in keyof A] : (
            A[index] extends IColumn ?
            (
                B[Extract<index, keyof B>] extends IColumn|IExprSelectItem ?
                ColumnUtil.WithType<
                    A[index],
                    (
                        | tm.OutputOf<A[index]["mapper"]>
                        | tm.OutputOf<B[Extract<index, keyof B>]["mapper"]>
                    )
                > :
                never
            ) :
            A[index] extends IExprSelectItem ?
            (
                B[Extract<index, keyof B>] extends IColumn|IExprSelectItem ?
                ExprSelectItemUtil.WithType<
                    A[index],
                    (
                        | tm.OutputOf<A[index]["mapper"]>
                        | tm.OutputOf<B[Extract<index, keyof B>]["mapper"]>
                    )
                > :
                never
            ) :
            A[index] extends ColumnMap ?
            (
                B[Extract<index, keyof B>] extends ColumnMap ?
                ColumnMapUtil.Compound<
                    A[index],
                    B[Extract<index, keyof B>]
                > :
                never
            ) :
            A[index] extends ColumnRef ?
            (
                B[Extract<index, keyof B>] extends ColumnRef ?
                ColumnRefUtil.Compound<
                    A[index],
                    B[Extract<index, keyof B>]
                > :
                never
            ) :
            never
        )
    }
;

export type LeftCompound<
    A extends SelectClause,
    B extends SelectClause
> =
    Extract<
        LeftCompoundImpl<A, B>,
        SelectItem[]
    >
;
/**
 * Assumes `A` is shorter than, or the same length as `B`
 */
export function leftCompound<
    A extends SelectClause,
    B extends SelectClause
> (
    a : A,
    b : B
) : (
    LeftCompound<A, B>
) {
    const result : SelectItem[] = [];

    for (let i=0; i<a.length; ++i) {
        const itemA = a[i];
        const itemB = b[i];
        if (ColumnUtil.isColumn(itemA)) {
            if (ColumnUtil.isColumn(itemB) || ExprSelectItemUtil.isExprSelectItem(itemB)) {
                result.push(ColumnUtil.withType(
                    itemA,
                    tm.or(
                        itemA.mapper,
                        itemB.mapper
                    )
                ));
            } else {
                throw new Error(`Expected index ${i} to be Column or ExprSelectItem`);
            }
        } else if (ExprSelectItemUtil.isExprSelectItem(itemA)) {
            if (ColumnUtil.isColumn(itemB) || ExprSelectItemUtil.isExprSelectItem(itemB)) {
                result.push(ExprSelectItemUtil.withType(
                    itemA,
                    tm.or(
                        itemA.mapper,
                        itemB.mapper
                    )
                ));
            } else {
                throw new Error(`Expected index ${i} to be Column or ExprSelectItem`);
            }
        } else if (ColumnMapUtil.isColumnMap(itemA)) {
            if (ColumnMapUtil.isColumnMap(itemB)) {
                result.push(ColumnMapUtil.compound(
                    itemA,
                    itemB
                ));
            } else {
                throw new Error(`Expected index ${i} to be ColumnMap`);
            }
        } else if (ColumnRefUtil.isColumnRef(itemA)) {
            if (ColumnRefUtil.isColumnRef(itemB)) {
                result.push(ColumnRefUtil.compound(
                    itemA,
                    itemB
                ));
            } else {
                throw new Error(`Expected index ${i} to be ColumnMap`);
            }
        } else {
            throw new Error(`Unknown SELECT item at index ${i}`);
        }
    }

    return result as unknown as LeftCompound<A, B>;
}

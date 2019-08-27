import {SelectClause} from "../../select-clause";
import {IFromClause} from "../../../from-clause";
import {ColumnRef} from "../../../column-ref";
import {ToUnknownIfAllPropertiesNever, ToNeverIfUnknown, AssertNonUnion} from "../../../type-util";
import {IExprSelectItem, ExprSelectItemUtil} from "../../../expr-select-item";
import {UsedRefUtil} from "../../../used-ref";
import {IColumn, ColumnUtil} from "../../../column";
import {ColumnMap, ColumnMapUtil} from "../../../column-map";
import {AllowedUsedRef, allowedColumnRef} from "../query";
import {ColumnIdentifierRefUtil} from "../../../column-identifier-ref";

type AssertValidExprSelectItemUsedRef<
    FromClauseT extends IFromClause,
    SelectsT extends SelectClause
> =
    ToUnknownIfAllPropertiesNever<{
        [index in Extract<keyof SelectsT, string>] : (
            SelectsT[index] extends IExprSelectItem ?
            ToNeverIfUnknown<
                & AssertNonUnion<SelectsT[index]>
                & UsedRefUtil.AssertAllowed<
                    AllowedUsedRef<FromClauseT>,
                    SelectsT[index]["usedRef"]
                >
            > :
            never
        )
    }>
;

type AssertValidColumnUsedRef<
    FromClauseT extends IFromClause,
    SelectsT extends SelectClause
> =
    ToUnknownIfAllPropertiesNever<{
        [index in Extract<keyof SelectsT, string>] : (
            SelectsT[index] extends IColumn ?
            ToNeverIfUnknown<
                & AssertNonUnion<SelectsT[index]>
                & UsedRefUtil.AssertAllowed<
                AllowedUsedRef<FromClauseT>,
                    UsedRefUtil.FromColumn<SelectsT[index]>
                >
            > :
            never
        )
    }>
;

type AssertValidColumnMapUsedRef<
    FromClauseT extends IFromClause,
    SelectsT extends SelectClause
> =
    ToUnknownIfAllPropertiesNever<{
        [index in Extract<keyof SelectsT, string>] : (
            SelectsT[index] extends ColumnMap ?
            ToNeverIfUnknown<
                & AssertNonUnion<SelectsT[index]>
                & UsedRefUtil.AssertAllowed<
                AllowedUsedRef<FromClauseT>,
                    UsedRefUtil.FromColumnMap<SelectsT[index]>
                >
            > :
            never
        )
    }>
;

type AssertValidColumnRefUsedRef<
    FromClauseT extends IFromClause,
    SelectsT extends SelectClause
> =
    ToUnknownIfAllPropertiesNever<{
        [index in Extract<keyof SelectsT, string>] : (
            SelectsT[index] extends ColumnRef ?
            ToNeverIfUnknown<
                & AssertNonUnion<SelectsT[index]>
                & UsedRefUtil.AssertAllowed<
                AllowedUsedRef<FromClauseT>,
                    UsedRefUtil.FromColumnRef<SelectsT[index]>
                >
            > :
            never
        )
    }>
;

export type AssertValidUsedRef<
    FromClauseT extends IFromClause,
    SelectsT extends SelectClause
> =
    & AssertValidExprSelectItemUsedRef<FromClauseT, SelectsT>
    & AssertValidColumnUsedRef<FromClauseT, SelectsT>
    & AssertValidColumnMapUsedRef<FromClauseT, SelectsT>
    & AssertValidColumnRefUsedRef<FromClauseT, SelectsT>
;
export function assertValidUsedRef (
    fromClause : IFromClause,
    selects : SelectClause
) {
    const columns = allowedColumnRef(fromClause);
    for (const selectItem of selects) {
        if (ExprSelectItemUtil.isExprSelectItem(selectItem)) {
            UsedRefUtil.assertAllowed(
                { columns },
                selectItem.usedRef
            );
        } else if (ColumnUtil.isColumn(selectItem)) {
            ColumnIdentifierRefUtil.assertHasColumnIdentifier(
                columns,
                selectItem
            );
        } else if (ColumnMapUtil.isColumnMap(selectItem)) {
            UsedRefUtil.assertAllowed(
                { columns },
                UsedRefUtil.fromColumnMap(selectItem)
            );
        } else {
            UsedRefUtil.assertAllowed(
                { columns },
                UsedRefUtil.fromColumnRef(selectItem)
            );
        }
    }
}

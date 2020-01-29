import {SelectClause} from "../../select-clause";
import {IFromClause} from "../../../from-clause";
import {ColumnRef} from "../../../column-ref";
import {ToUnknownIfAllPropertiesNever, ToNeverIfUnknown, AssertNonUnion} from "../../../type-util";
import {IExprSelectItem, ExprSelectItemUtil} from "../../../expr-select-item";
import {UsedRefUtil} from "../../../used-ref";
import {IColumn, ColumnUtil} from "../../../column";
import {ColumnMap, ColumnMapUtil} from "../../../column-map";
import {AllowedNonAggregateUsedRef, allowedNonAggregateColumnRef} from "../query";
import {ColumnIdentifierRefUtil} from "../../../column-identifier-ref";
import {GroupByClause} from "../../../group-by-clause";

type AssertValidExprSelectItemUsedRef_NonAggregate<
    FromClauseT extends IFromClause,
    GroupByClauseT extends GroupByClause,
    SelectsT extends SelectClause
> =
    ToUnknownIfAllPropertiesNever<{
        [index in Extract<keyof SelectsT, string>] : (
            SelectsT[index] extends IExprSelectItem ?
            (
                false extends SelectsT[index]["isAggregate"] ?
                ToNeverIfUnknown<
                    & AssertNonUnion<SelectsT[index]>
                    & UsedRefUtil.AssertAllowedCustom<
                        "The following columns cannot be referenced in non-aggregate expressions; they are not in the GROUP BY clause",
                        AllowedNonAggregateUsedRef<FromClauseT, GroupByClauseT>,
                        SelectsT[index]["usedRef"]
                    >
                > :
                never
            ) :
            never
        )
    }>
;

type AssertValidColumnUsedRef_NonAggregate<
    FromClauseT extends IFromClause,
    GroupByClauseT extends GroupByClause,
    SelectsT extends SelectClause
> =
    ToUnknownIfAllPropertiesNever<{
        [index in Extract<keyof SelectsT, string>] : (
            SelectsT[index] extends IColumn ?
            ToNeverIfUnknown<
                & AssertNonUnion<SelectsT[index]>
                & UsedRefUtil.AssertAllowedCustom<
                    "The following columns cannot be referenced in non-aggregate expressions; they are not in the GROUP BY clause",
                    AllowedNonAggregateUsedRef<FromClauseT, GroupByClauseT>,
                    UsedRefUtil.FromColumn<SelectsT[index]>
                >
            > :
            never
        )
    }>
;

type AssertValidColumnMapUsedRef_NonAggregate<
    FromClauseT extends IFromClause,
    GroupByClauseT extends GroupByClause,
    SelectsT extends SelectClause
> =
    ToUnknownIfAllPropertiesNever<{
        [index in Extract<keyof SelectsT, string>] : (
            SelectsT[index] extends ColumnMap ?
            ToNeverIfUnknown<
                & AssertNonUnion<SelectsT[index]>
                & UsedRefUtil.AssertAllowedCustom<
                    "The following columns cannot be referenced in non-aggregate expressions; they are not in the GROUP BY clause",
                    AllowedNonAggregateUsedRef<FromClauseT, GroupByClauseT>,
                    UsedRefUtil.FromColumnMap<SelectsT[index]>
                >
            > :
            never
        )
    }>
;

type AssertValidColumnRefUsedRef_NonAggregate<
    FromClauseT extends IFromClause,
    GroupByClauseT extends GroupByClause,
    SelectsT extends SelectClause
> =
    ToUnknownIfAllPropertiesNever<{
        [index in Extract<keyof SelectsT, string>] : (
            SelectsT[index] extends ColumnRef ?
            ToNeverIfUnknown<
                & AssertNonUnion<SelectsT[index]>
                & UsedRefUtil.AssertAllowedCustom<
                    "The following columns cannot be referenced in non-aggregate expressions; they are not in the GROUP BY clause",
                    AllowedNonAggregateUsedRef<FromClauseT, GroupByClauseT>,
                    UsedRefUtil.FromColumnRef<SelectsT[index]>
                >
            > :
            never
        )
    }>
;

export type AssertValidUsedRef_NonAggregate<
    FromClauseT extends IFromClause,
    GroupByClauseT extends GroupByClause,
    SelectsT extends SelectClause
> =
    & AssertValidExprSelectItemUsedRef_NonAggregate<FromClauseT, GroupByClauseT, SelectsT>
    & AssertValidColumnUsedRef_NonAggregate<FromClauseT, GroupByClauseT, SelectsT>
    & AssertValidColumnMapUsedRef_NonAggregate<FromClauseT, GroupByClauseT, SelectsT>
    & AssertValidColumnRefUsedRef_NonAggregate<FromClauseT, GroupByClauseT, SelectsT>
;
export function assertValidUsedRef_NonAggregate (
    fromClause : IFromClause,
    groupByClause : GroupByClause,
    selects : SelectClause
) {
    const columns = allowedNonAggregateColumnRef(fromClause, groupByClause);
    for (const selectItem of selects) {
        if (ExprSelectItemUtil.isExprSelectItem(selectItem)) {
            if (!selectItem.isAggregate) {
                UsedRefUtil.assertAllowed(
                    { columns },
                    selectItem.usedRef
                );
            }
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

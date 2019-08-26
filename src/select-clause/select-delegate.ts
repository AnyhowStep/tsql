import {IFromClause} from "../from-clause";
import {ColumnRefUtil, ColumnRef} from "../column-ref";
import * as SelectClauseUtil from "./util";
import {SelectItem} from "../select-item";
import {ToUnknownIfAllPropertiesNever, ToNeverIfUnknown, AssertNonUnion} from "../type-util";
import {IExprSelectItem} from "../expr-select-item";
import {UsedRefUtil} from "../used-ref";
import {IColumn} from "../column";
import {ColumnMap} from "../column-map";

type AssertValidIExprSelectItemUsedRef<
    FromClauseT extends IFromClause,
    SelectsT extends readonly SelectItem[]
> =
    ToUnknownIfAllPropertiesNever<{
        [index in Extract<keyof SelectsT, string>] : (
            SelectsT[index] extends IExprSelectItem ?
            ToNeverIfUnknown<
                & AssertNonUnion<SelectsT[index]>
                & UsedRefUtil.AssertAllowed<
                    SelectClauseUtil.AllowedUsedRef<FromClauseT>,
                    SelectsT[index]["usedRef"]
                >
            > :
            never
        )
    }>
;

type AssertValidColumnUsedRef<
    FromClauseT extends IFromClause,
    SelectsT extends readonly SelectItem[]
> =
    ToUnknownIfAllPropertiesNever<{
        [index in Extract<keyof SelectsT, string>] : (
            SelectsT[index] extends IColumn ?
            ToNeverIfUnknown<
                & AssertNonUnion<SelectsT[index]>
                & UsedRefUtil.AssertAllowed<
                SelectClauseUtil.AllowedUsedRef<FromClauseT>,
                    UsedRefUtil.FromColumn<SelectsT[index]>
                >
            > :
            never
        )
    }>
;

type AssertValidColumnMapUsedRef<
    FromClauseT extends IFromClause,
    SelectsT extends readonly SelectItem[]
> =
    ToUnknownIfAllPropertiesNever<{
        [index in Extract<keyof SelectsT, string>] : (
            SelectsT[index] extends ColumnMap ?
            ToNeverIfUnknown<
                & AssertNonUnion<SelectsT[index]>
                & UsedRefUtil.AssertAllowed<
                SelectClauseUtil.AllowedUsedRef<FromClauseT>,
                    UsedRefUtil.FromColumnMap<SelectsT[index]>
                >
            > :
            never
        )
    }>
;

type AssertValidColumnRefUsedRef<
    FromClauseT extends IFromClause,
    SelectsT extends readonly SelectItem[]
> =
    ToUnknownIfAllPropertiesNever<{
        [index in Extract<keyof SelectsT, string>] : (
            SelectsT[index] extends ColumnRef ?
            ToNeverIfUnknown<
                & AssertNonUnion<SelectsT[index]>
                & UsedRefUtil.AssertAllowed<
                SelectClauseUtil.AllowedUsedRef<FromClauseT>,
                    UsedRefUtil.FromColumnRef<SelectsT[index]>
                >
            > :
            never
        )
    }>
;

export type SelectDelegate<
    FromClauseT extends IFromClause,
    SelectsT extends readonly SelectItem[]
> =
    (
        columns : ColumnRefUtil.TryFlatten<
            SelectClauseUtil.AllowedColumnRef<FromClauseT>
        >
    ) => (
        SelectsT
        /**
         * Hack to force TS to infer a non-empty tuple type, rather than array type.
         */
        & { "0" : unknown }
        & AssertNonUnion<SelectsT>
        & AssertValidIExprSelectItemUsedRef<FromClauseT, SelectsT>
        & AssertValidColumnUsedRef<FromClauseT, SelectsT>
        & AssertValidColumnMapUsedRef<FromClauseT, SelectsT>
        & AssertValidColumnRefUsedRef<FromClauseT, SelectsT>
    )
;

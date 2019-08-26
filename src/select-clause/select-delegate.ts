import {IFromClause} from "../from-clause";
import {ColumnRefUtil, ColumnRef} from "../column-ref";
import * as SelectClauseUtil from "./util";
import {SelectItem} from "../select-item";
import {ToUnknownIfAllPropertiesNever, ToNeverIfUnknown, AssertNonUnion} from "../type-util";
import {IExprSelectItem} from "../expr-select-item";
import {UsedRefUtil} from "../used-ref";
import {IColumn} from "../column";
import {ColumnMap} from "../column-map";
import {SelectClause} from "./select-clause";
import {ColumnIdentifierUtil} from "../column-identifier";
import {CompileError} from "../compile-error";

type AssertValidExprSelectItemUsedRef<
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

type AssertDisjointColumnIdentifier<
    SelectClauseT extends SelectClause|undefined,
    SelectsT extends SelectClause
> =
    SelectClauseT extends SelectClause ?
    (
        Extract<
            ColumnIdentifierUtil.FromSelectItem<SelectsT[number]>,
            ColumnIdentifierUtil.FromSelectItem<SelectClauseT[number]>
        > extends never ?
        unknown :
        CompileError<[
            "Identifiers already used in SELECT clause; consider aliasing",
            ColumnIdentifierUtil.ToErrorMessageFriendlyType<
                Extract<
                    ColumnIdentifierUtil.FromSelectItem<SelectsT[number]>,
                    ColumnIdentifierUtil.FromSelectItem<SelectClauseT[number]>
                >
            >
        ]>
    ) :
    unknown
;

export type SelectDelegate<
    FromClauseT extends IFromClause,
    SelectClauseT extends SelectClause|undefined,
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
        & AssertValidExprSelectItemUsedRef<FromClauseT, SelectsT>
        & AssertValidColumnUsedRef<FromClauseT, SelectsT>
        & AssertValidColumnMapUsedRef<FromClauseT, SelectsT>
        & AssertValidColumnRefUsedRef<FromClauseT, SelectsT>

        & AssertDisjointColumnIdentifier<SelectClauseT, SelectsT>
    )
;

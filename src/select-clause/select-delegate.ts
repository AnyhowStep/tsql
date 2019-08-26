import {IFromClause} from "../from-clause";
import {ColumnRefUtil} from "../column-ref";
import * as SelectClauseUtil from "./util";
import {SelectItem} from "../select-item";
import {ToUnknownIfAllPropertiesNever, ToNeverIfUnknown, AssertNonUnion} from "../type-util";
import {IExprSelectItem} from "../expr-select-item";
import {UsedRefUtil} from "../used-ref";
import {IColumn} from "../column";

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
        & AssertValidIExprSelectItemUsedRef<FromClauseT, SelectsT>
        & AssertValidColumnUsedRef<FromClauseT, SelectsT>
    )
;

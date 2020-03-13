import * as tm from "type-mapping";
import {IFromClause} from "../from-clause";
import {ColumnRefUtil} from "../column-ref";
import {IExpr} from "../expr";
import * as WhereClauseUtil from "./util";
import {ColumnUtil} from "../column";
import {Identity} from "../type-util";

export type WhereDelegateReturnType<
    FromClauseT extends IFromClause
> =
    Identity<
        | boolean
        | IExpr<{
            mapper : tm.SafeMapper<boolean>,
            usedRef : WhereClauseUtil.AllowedUsedRef<FromClauseT>,
            isAggregate : false,
        }>
        | ColumnUtil.ExtractWithType<
            ColumnUtil.FromColumnRef<
                WhereClauseUtil.AllowedColumnRef<FromClauseT>
            >,
            boolean
        >
    >
;

export type WhereDelegateColumns<
    FromClauseT extends IFromClause
> =
    ColumnRefUtil.TryFlatten<
        WhereClauseUtil.AllowedColumnRef<FromClauseT>
    >
;

export type WhereDelegate<
    FromClauseT extends IFromClause
> =
    (
        columns : WhereDelegateColumns<FromClauseT>
    ) => WhereDelegateReturnType<FromClauseT>
;

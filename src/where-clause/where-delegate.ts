import * as tm from "type-mapping";
import {IFromClause} from "../from-clause";
import {ColumnRefUtil} from "../column-ref";
import {IExpr} from "../expr";
import * as WhereClauseUtil from "./util";
import {ColumnUtil} from "../column";

export type WhereDelegate<
    FromClauseT extends IFromClause
> = (
    (
        columns : ColumnRefUtil.TryFlatten<
            WhereClauseUtil.AllowedColumnRef<FromClauseT>
        >
    ) => (
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
    )
);

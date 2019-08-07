import * as tm from "type-mapping";
import {IFromClause} from "../from-clause";
import {ColumnRefUtil} from "../column-ref";
import {IExpr} from "../expr";
import * as WhereClauseUtil from "./util";

export type WhereDelegate<
    FromClauseT extends IFromClause
> = (
    (
        columns : ColumnRefUtil.FromFromClause<FromClauseT>
    ) => IExpr<{
        mapper : tm.SafeMapper<boolean>,
        usedRef : WhereClauseUtil.AllowedUsedRef<FromClauseT>
    }>
);

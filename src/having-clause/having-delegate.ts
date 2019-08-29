import * as tm from "type-mapping";
import {IFromClause} from "../from-clause";
import {ColumnRefUtil} from "../column-ref";
import {IExpr} from "../expr";
import * as HavingClauseUtil from "./util";

/**
 * For now, this is basically the same as `WhereDelegate<>`.
 *
 * They will diverge when,
 * + The `WHERE` clause is prevented from using aggregation functions.
 * + The `HAVING` clause enforces proper `GROUP BY` interactions.
 */
export type HavingDelegate<
    FromClauseT extends IFromClause
> = (
    (
        columns : ColumnRefUtil.TryFlatten<
            HavingClauseUtil.AllowedColumnRef<FromClauseT>
        >
    ) => IExpr<{
        mapper : tm.SafeMapper<boolean>,
        usedRef : HavingClauseUtil.AllowedUsedRef<FromClauseT>
    }>
);

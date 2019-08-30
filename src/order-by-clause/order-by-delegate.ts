import * as tm from "type-mapping";
import {IFromClause} from "../from-clause";
import {ColumnRefUtil} from "../column-ref";
import {IExpr} from "../expr";
import {ColumnUtil} from "../column";
import {IExprSelectItem} from "../expr-select-item";
import {SortDirection} from "../sort-direction";
import * as OrderByClauseUtil from "./util";

/**
 * This will change when,
 * + The `ORDER BY` clause enforces proper `GROUP BY` interactions.
 *
 * @todo Move this to `util`
 */
type ValidSortExpr<
    FromClauseT extends IFromClause
> =
    | ColumnUtil.FromColumnRef<OrderByClauseUtil.AllowedColumnRef<FromClauseT>>
    | IExpr<{
        mapper : tm.SafeMapper<unknown>,
        usedRef : OrderByClauseUtil.AllowedUsedRef<FromClauseT>
    }>
    | IExprSelectItem<{
        mapper : tm.SafeMapper<unknown>,
        usedRef : OrderByClauseUtil.AllowedUsedRef<FromClauseT>,
        /**
         * @todo Determine if passing an aliased column is OK
         */
        tableAlias : string,
        alias : string,
    }>
;

/**
 * This will change when,
 * + The `ORDER BY` clause enforces proper `GROUP BY` interactions.
 */
export type OrderByDelegate<
    /**
     * @todo Debate if this should be changed to `FromClauseUtil.AfterFromClause`
     * It doesn't make much sense to use `ORDER BY` without a `FROM` clause.
     * Are you going to order one row?
     */
    FromClauseT extends IFromClause
> = (
    (
        columns : ColumnRefUtil.TryFlatten<
            OrderByClauseUtil.AllowedColumnRef<FromClauseT>
        >
    ) => (
        /**
         * This does not have to be a tuple.
         *
         * It can be an array.
         */
        (
            | ValidSortExpr<FromClauseT>
            | readonly [ValidSortExpr<FromClauseT>, SortDirection]
        )[]
    )
);

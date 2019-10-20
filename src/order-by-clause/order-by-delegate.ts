import * as tm from "type-mapping";
import {IFromClause} from "../from-clause";
import {ColumnRefUtil} from "../column-ref";
import {IExpr} from "../expr";
import {ColumnUtil} from "../column";
import {IExprSelectItem} from "../expr-select-item";
import {SortDirection} from "../sort-direction";
import * as OrderByClauseUtil from "./util";
import {SelectClause} from "../select-clause";

/**
 * This will change when,
 * + The `ORDER BY` clause enforces proper `GROUP BY` interactions.
 *
 * @todo Move this to `util`
 */
type ValidSortExpr<
    FromClauseT extends IFromClause,
    SelectClauseT extends SelectClause|undefined
> =
    | ColumnUtil.FromColumnRef<OrderByClauseUtil.AllowedColumnRef<FromClauseT, SelectClauseT>>
    | IExpr<{
        mapper : tm.SafeMapper<unknown>,
        usedRef : OrderByClauseUtil.AllowedUsedRef<FromClauseT, SelectClauseT>
    }>
    | IExprSelectItem<{
        mapper : tm.SafeMapper<unknown>,
        usedRef : OrderByClauseUtil.AllowedUsedRef<FromClauseT, SelectClauseT>,
        /**
         * @todo Determine if passing an aliased column is OK
         */
        tableAlias : string,
        alias : string,
    }>
;

export type OrderByDelegateColumns<
    /**
     * @todo Debate if this should be changed to `FromClauseUtil.AfterFromClause`
     * It doesn't make much sense to use `ORDER BY` without a `FROM` clause.
     * Are you going to order one row?
     */
    FromClauseT extends IFromClause,
    SelectClauseT extends SelectClause|undefined
> =
    ColumnRefUtil.TryFlatten<
        OrderByClauseUtil.AllowedColumnRef<FromClauseT, SelectClauseT>
    >
;

export type OrderByDelegateReturnType<
    /**
     * @todo Debate if this should be changed to `FromClauseUtil.AfterFromClause`
     * It doesn't make much sense to use `ORDER BY` without a `FROM` clause.
     * Are you going to order one row?
     */
    FromClauseT extends IFromClause,
    SelectClauseT extends SelectClause|undefined
> =
    /**
     * This does not have to be a tuple.
     *
     * It can be an array.
     */
    readonly (
        | ValidSortExpr<FromClauseT, SelectClauseT>
        | readonly [ValidSortExpr<FromClauseT, SelectClauseT>, SortDirection]
    )[]
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
    FromClauseT extends IFromClause,
    SelectClauseT extends SelectClause|undefined
> = (
    (
        columns : OrderByDelegateColumns<FromClauseT, SelectClauseT>
    ) => OrderByDelegateReturnType<FromClauseT, SelectClauseT>
);

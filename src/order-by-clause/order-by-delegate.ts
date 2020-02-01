/**
 * 1. `GROUP BY` clause exists?
 * 2. Non-aggregate expression used?
 * 3. Aggregate expression used?
 *
 * | 1 | 2 | 3 | Result
 * |---|---|---|--------
 * | Y | Y | Y | non-aggregate must use grouped columns
 * | Y | Y | N | non-aggregate must use grouped columns
 * | Y | N | Y | no problems
 * | Y | N | N | no problems
 * | N | Y | Y | compile error; use explicit group by
 * | N | Y | N | no problems
 * | N | N | Y | create empty grouping set
 * | N | N | N | no problems
 */
import * as tm from "type-mapping";
import {IFromClause} from "../from-clause";
import {ColumnRefUtil} from "../column-ref";
import {IExpr} from "../expr";
import {ColumnUtil} from "../column";
import {IExprSelectItem} from "../expr-select-item";
import {SortDirection} from "../sort-direction";
import * as OrderByClauseUtil from "./util";
import {SelectClause} from "../select-clause";
import {GroupByClause} from "../group-by-clause";
import {Identity} from "../type-util";

/**
 * No aggregate expressions allowed.
 *
 * @todo Move this to `util`?
 */
type ValidSortExpr_WithoutGroupByClause<
    FromClauseT extends IFromClause,
    SelectClauseT extends SelectClause|undefined
> =
    Identity<
        | ColumnUtil.FromColumnRef<
            /**
             * This should technically exclude all aggregate expressions from
             * `SelectClauseT`.
             *
             * But this type should only be used if no aggregate expressions are used.
             * So, this is fine.
             */
            OrderByClauseUtil.AllowedColumnRef<FromClauseT, SelectClauseT>
        >
        | IExpr<{
            mapper : tm.SafeMapper<unknown>,
            /**
             * This should technically exclude all aggregate expressions from
             * `SelectClauseT`.
             *
             * But this type should only be used if no aggregate expressions are used.
             * So, this is fine.
             */
            usedRef : OrderByClauseUtil.AllowedUsedRef<FromClauseT, SelectClauseT>,
            isAggregate : false,
        }>
        | IExprSelectItem<{
            mapper : tm.SafeMapper<unknown>,
            /**
             * This should technically exclude all aggregate expressions from
             * `SelectClauseT`.
             *
             * But this type should only be used if no aggregate expressions are used.
             * So, this is fine.
             */
            usedRef : OrderByClauseUtil.AllowedUsedRef<FromClauseT, SelectClauseT>,
            isAggregate : false,
            /**
             * @todo Determine if passing an aliased column is OK
             */
            tableAlias : string,
            alias : string,
        }>
    >
;
/**
 * Aggregate expressions allowed.
 *
 * @todo Move this to `util`?
 */
type ValidSortExpr_WithGroupByClause<
    FromClauseT extends IFromClause,
    GroupByClauseT extends GroupByClause,
    SelectClauseT extends SelectClause|undefined
> =
    Identity<
        | ColumnUtil.FromColumnRef<OrderByClauseUtil.AllowedNonAggregateColumnRef<FromClauseT, GroupByClauseT, SelectClauseT>>
        | IExpr<{
            mapper : tm.SafeMapper<unknown>,
            usedRef : OrderByClauseUtil.AllowedUsedRef<FromClauseT, SelectClauseT>,
            isAggregate : true,
        }>
        | IExprSelectItem<{
            mapper : tm.SafeMapper<unknown>,
            usedRef : OrderByClauseUtil.AllowedUsedRef<FromClauseT, SelectClauseT>,
            isAggregate : true,
            /**
             * @todo Determine if passing an aliased column is OK
             */
            tableAlias : string,
            alias : string,
        }>
        /**
         * If `isAggregate` is `false` or `boolean`, we treat it
         * as a non-aggregate expression.
         *
         * Non-aggregate expressions have more restrictions
         * on what can be referenced.
         */
        | IExpr<{
            mapper : tm.SafeMapper<unknown>,
            usedRef : OrderByClauseUtil.AllowedNonAggregateUsedRef<FromClauseT, GroupByClauseT, SelectClauseT>,
            isAggregate : boolean,
        }>
        | IExprSelectItem<{
            mapper : tm.SafeMapper<unknown>,
            usedRef : OrderByClauseUtil.AllowedNonAggregateUsedRef<FromClauseT, GroupByClauseT, SelectClauseT>,
            isAggregate : boolean,
            /**
             * @todo Determine if passing an aliased column is OK
             */
            tableAlias : string,
            alias : string,
        }>
    >
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
    GroupByClauseT extends GroupByClause|undefined,
    SelectClauseT extends SelectClause|undefined
> =
    (
        GroupByClauseT extends GroupByClause ?
        readonly (
            | ValidSortExpr_WithGroupByClause<FromClauseT, GroupByClauseT, SelectClauseT>
            | readonly [ValidSortExpr_WithGroupByClause<FromClauseT, GroupByClauseT, SelectClauseT>, SortDirection]
        )[] :
        readonly (
            | ValidSortExpr_WithoutGroupByClause<FromClauseT, SelectClauseT>
            | readonly [ValidSortExpr_WithoutGroupByClause<FromClauseT, SelectClauseT>, SortDirection]
        )[]
    )
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
    GroupByClauseT extends GroupByClause|undefined,
    SelectClauseT extends SelectClause|undefined
> = (
    (
        columns : OrderByDelegateColumns<FromClauseT, SelectClauseT>
    ) => OrderByDelegateReturnType<FromClauseT, GroupByClauseT, SelectClauseT>
);

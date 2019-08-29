import {IColumn} from "../column";
import {IExpr} from "../expr";
import {SortDirection} from "../sort-direction";
import {IExprSelectItem} from "../expr-select-item";

/**
 * These types are sortable.
 *
 * ```sql
 * ORDER BY
 *  myTable.myColumn ASC
 * ```
 *
 * -----
 *
 * ```sql
 * ORDER BY
 *  RAND() ASC
 * ```
 *
 * -----
 *
 * ```sql
 * SELECT
 *  myTable.myColumn + RAND() AS x
 * FROM
 *  myTable
 * ORDER BY
 *  x --This is an `IColumn` with `__isFromExprSelectItem` set to true
 * ```
 *
 * -----
 *
 * We allow sorting by `IExprSelectItem` out of convenience.
 * Internally, it just uses the `Expr` part of the `IExprSelectItem`
 * and discards the `alias`.
 */
export type SortExpr = IColumn|IExpr|IExprSelectItem;
/**
 * A 2-tuple that describes a sort order in MySQL.
 */
export type Order = readonly [SortExpr, SortDirection];
/**
 * This,
 *
 * ```sql
 * ORDER BY
 *  mySortExpr
 * ```
 *
 * is the same as,
 * ```sql
 * ORDER BY
 *  mySortExpr ASC
 * ```
 */
export type RawOrder = SortExpr|Order;

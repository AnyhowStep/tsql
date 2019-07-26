import {IColumn} from "../column";
import {IExpr} from "../expr";
import {SortDirection} from "../sort-direction";

//TODO-DEBATE Consider letting IExprSelectItem be a SortExpr?
//Then, we'd just use the `unaliasedAst`
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
 */
export type SortExpr = IColumn|IExpr;
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
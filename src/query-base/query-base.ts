import {IFromClause} from "../from-clause";
import {SelectClause} from "../select-clause";
import {CompoundQueryClause} from "../compound-query-clause";
import {LimitClause} from "../limit-clause";
import {WhereClause} from "../where-clause";
import {GroupByClause} from "../group-by-clause";
import {HavingClause} from "../having-clause";
import {OrderByClause} from "../order-by-clause";
import {CompoundQueryOrderByClause} from "../compound-query-order-by-clause";
import {MapDelegate} from "../map-delegate";

export interface QueryBaseData {
    readonly fromClause : IFromClause,
    readonly selectClause : SelectClause|undefined,

    readonly limitClause : LimitClause|undefined,

    readonly compoundQueryClause : CompoundQueryClause|undefined,
    readonly compoundQueryLimitClause : LimitClause|undefined,

    readonly mapDelegate : MapDelegate|undefined,

    /**
     * When a `HAVING` clause exists without a `GROUP BY` clause,
     * it is usually an error.
     *
     * When SQL-fying, we should treat a missing `GROUP BY` clause as an `<empty grouping set>`.
     *
     * -----
     *
     * + PostgreSQL 10.0    : `GROUP BY ()` (SQL 1999)
     * + PostgreSQL  9.4    : `GROUP BY NULL || NULL` (Apply string concatenation on two `NULL` values to get `NULL`)
     * + MySQL       8.0    : `GROUP BY NULL`
     * + MySQL       5.7    : `GROUP BY NULL`
     * + SQLite      3.28   : `GROUP BY NULL`
     *
     * https://blog.jooq.org/2018/05/25/how-to-group-by-nothing-in-sql/
     */
    readonly groupByClause : GroupByClause|undefined,
}

/**
 * All database-specific libraries should implement this interface.
 */
export interface IQueryBase<DataT extends QueryBaseData=QueryBaseData> {
    readonly fromClause : DataT["fromClause"],
    readonly selectClause : DataT["selectClause"],

    readonly limitClause : DataT["limitClause"],

    readonly compoundQueryClause : DataT["compoundQueryClause"],
    /**
     * In MySQL 5.7, a `COMPOUND QUERY LIMIT` clause without a `COMPOUND QUERY` clause
     * **overwrites** the `LIMIT` clause.
     *
     * In PostgreSQL 9.4, it is an error.
     *
     * In SQLite 3.28, it is an error.
     *
     * However, for this library, the generated SQL
     * for PostgreSQL and SQLite will emulate MySQL's behaviour.
     */
    readonly compoundQueryLimitClause : DataT["compoundQueryLimitClause"],

    /**
     * A `MapDelegate` lets you transform each row of the result set
     * before it is returned.
     *
     * ```ts
     *  const resultSet : (
     *      {
     *          x : number
     *      }[]
     *  ) = await myQuery
     *      .select(columns => [
     *          columns.myTable.myColumn0,
     *          columns.myTable.myColumn1,
     *          columns.myTable.myColumn2,
     *      ])
     *      .map((row) => {
     *          return {
     *              x : row.myTable.myColumn0 + row.myTable.myColumn1 + row.myTable.myColumn2,
     *          };
     *      })
     *      .fetchAll(connection);
     * ```
     */
    readonly mapDelegate : DataT["mapDelegate"],

    readonly groupByClause : DataT["groupByClause"],

    readonly whereClause : WhereClause|undefined,
    readonly havingClause : HavingClause|undefined,
    readonly orderByClause : OrderByClause|undefined,
    readonly compoundQueryOrderByClause : CompoundQueryOrderByClause|undefined,
    /**
     * Should default to `false`.
     *
     * Affects the `SELECT` clause.
     * ```sql
     * -- isDistinct : false
     * SELECT ...
     * ```
     *
     * ```sql
     * -- isDistinct : true
     * SELECT DISTINCT ...
     * ```
     *
     * @todo Should this be part of the `SelectClause` type instead?
     */
    readonly isDistinct : boolean,
}

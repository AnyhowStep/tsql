import {IFromClause} from "../from-clause";
import {SelectClause} from "../select-clause";
import {CompoundQueryClause} from "../compound-query-clause";
import {LimitClause} from "../limit-clause";
import {WhereClause} from "../where-clause";
import {GroupByClause} from "../group-by-clause";
import {HavingClause} from "../having-clause";
import {OrderByClause} from "../order-by-clause";
import {CompoundQueryOrderByClause} from "../compound-query-order-by-clause";

export interface QueryBaseData {
    readonly fromClause : IFromClause,
    readonly selectClause : SelectClause|undefined,

    readonly limitClause : LimitClause|undefined,

    readonly compoundQueryClause : CompoundQueryClause|undefined,
    readonly compoundQueryLimitClause : LimitClause|undefined,

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

    readonly whereClause : WhereClause|undefined,
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
    readonly havingClause : HavingClause|undefined,
    readonly orderByClause : OrderByClause|undefined,
    readonly compoundQueryOrderByClause : CompoundQueryOrderByClause|undefined,
}

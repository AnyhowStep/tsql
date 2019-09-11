import {QueryBaseData, IQueryBase} from "../query-base";
import {WhereClause} from "../where-clause";
import {GroupByClause} from "../group-by-clause";
import {HavingClause} from "../having-clause";
import {OrderByClause} from "../order-by-clause";

/**
 * @todo Rename to `UnifiedQueryData` or something
 */
export interface QueryData extends QueryBaseData {
}
/**
 * @todo Rename to `ExtraUnifiedQueryData` or something
 */
export interface ExtraQueryData {
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
}

/**
 * @todo Rename to `IUnifiedQuery` or something
 */
export interface IQuery<DataT extends QueryData=QueryData> extends IQueryBase<DataT> {
}

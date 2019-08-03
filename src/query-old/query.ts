import {IJoin} from "../join";
import {SelectItem} from "../select-item";
import {IAnonymousExpr} from "../expr";
import * as QueryUtil from "./util";
import {ColumnIdentifier} from "../column-identifier";
import {Order} from "../order";
import {MapDelegate} from "../map-delegate";

export interface UnionQuery {
    //Defaults to true
    readonly distinct : boolean,
    readonly query : QueryUtil.AfterSelectClause,
}
//TODO-DEBATE consider allowing this to be bigint?
//A maxRowCount/offset of 3.141 would be weird
export interface LimitData {
    //This is called "max"RowCount and not rowCount
    //(like MySQL calls it) because we can say
    //we want a maxRowCount of 10 and only get 3 rows.
    //Or a maxRowCount of 1 and get zero rows.
    readonly maxRowCount : number,
    readonly offset   : number,
}
/*
    TODO-FEATURE Implement support for SQL_MODE=ONLY_FULL_GROUP_BY
    Supporting it will increase compile-time safety for queries.
    I don't know enough to implement this at the moment.

    Reject queries for which the

    + select list,
    + HAVING condition, or
    + ORDER BY list

    refer to nonaggregated columns that are neither

    1. named in the GROUP BY clause nor are
    2. functionally dependent on (uniquely determined by) GROUP BY columns.

    Part 1 seems "easy" enough.
    Part 2 is the challenging part.
    I *think* I have to look at the GROUP BY columns
    and also look at the candidate keys of the tables.

    1. If the GROUP BY columns are a super-set of any candidate key of a table,
    then we can refer to any column of the table.

    2. If the GROUP BY columns are used in the ON clause of a JOIN,
    then the columns they are equal to are also part of the GROUP BY columns.

    SELECT
        app.name
    FROM
        app
    JOIN
        user
    ON
        app.appId = user.appId
    GROUP BY
        user.appId

    In the above example, user.appId is in the GROUP BY columns.
    But we also have app.appId = user.appId in the ON clause.

    So, app.appId is implicitly part of the GROUP BY columns.

    And because app.appId is a super-set of a candidate key of the table app,
    then we can refer to any column of the app table.

    It seems like if I want to implement ONLY_FULL_GROUP_BY support,
    I'll need to also strongly type the ON clause of IJoin.

    My life is not going to be easy =/

    -----

    TODO-FEATURE Disable aggregate functions in WHERE clause
    This can probably be achieved by tagging certain interfaces with
    a `usesAggregateFunction` field.

    TODO-FEATURE
    Type narrowing where expressions
        + Same with WHERE, implemented internally with WHERE
    DISTINCT
        + Loose type (boolean)
    SQL_CALC_FOUND_ROWS
        + Loose type (boolean)
    FROM
        + Tight type
    JOIN
        + Tight type
        + Must be done after FROM clause
        + Uses joins
    SELECT
        + Tight type
        + Must be done after FROM clause
        + Uses joins/parentJoins
    WHERE
        + Loose type (IAnonymousTypedExpr<boolean>, undefined)
        + Must be done after FROM clause
        + Uses joins
        + Aggregate functions NOT allowed
    GROUP_BY
        + Loose type (ColumnIdentifier[], undefined)
        + Must be done after FROM clause
        + Uses joins and selects
    HAVING
        + Loose type (IAnonymousTypedExpr<boolean>, undefined)
        + Must be done after FROM clause
        + Uses joins and selects
        + Aggregate functions allowed
        + TECHNICALLY, can only use columns in GROUP BY,
          or columns in aggregate functions,
          But MySQL supports an extension that allows columns from SELECT
          As such, this library does not check for valid columns here
    ORDER_BY
        + Loose type (Order[], undefined)
          The actual type is a bit more complicated, it may allow a tuple
          with ASCENDING or DESCENDING
        + Must be done after FROM clause

          You can technically call this before FROM clause but
          there's little point in doing it... Why order one row?

        + Uses joins and selects
    LIMIT
        + Tight type
          Required so we know this query has a maxRowCount of 1
    UNION
        + Loose type (UnionQuery[], undefined)
        + Must be done after SELECT clause
        + Selected columns of UNION must match SELECT clause
    UNION's ORDER BY (Uses selects)
        + Loose type (Order[], undefined)
          The actual type is a bit more complicated, it may allow a tuple
          with ASCENDING or DESCENDING
        + Must be done after FROM or UNION clause

          The rationale is that we want to order *more than one row*.
          We are guaranteed more than one row after a FROM or UNION.

        + Uses selects
    UNION's LIMIT
        + Tight type
          Required so we know this query has a maxRowCount of 1
    Post-query map delegates
        + Must be done after SELECT clause
*/
export interface QueryData {
    readonly _distinct : boolean;
    readonly _sqlCalcFoundRows : boolean;

    readonly _joins : (readonly IJoin[])|undefined;
    readonly _parentJoins : (readonly IJoin[])|undefined;
    readonly _selects : (readonly SelectItem[])|undefined;
    readonly _where : IAnonymousExpr<boolean>|undefined;

    //GROUP BY clause columns
    //They are properly referred to as "aggregated columns"
    readonly _grouped : (readonly ColumnIdentifier[])|undefined;
    readonly _having : IAnonymousExpr<boolean>|undefined;

    readonly _orders : (readonly Order[])|undefined;
    readonly _limit : LimitData|undefined;

    readonly _unions : (readonly UnionQuery[])|undefined;
    readonly _unionOrders : (readonly Order[])|undefined;
    readonly _unionLimit : LimitData|undefined;

    readonly _mapDelegate : MapDelegate|undefined;
}
export interface IQuery<DataT extends QueryData=QueryData> {
    /**
     * ```sql
     * SELECT DISTINCT
     *  myColumnA,
     *  myColumnB
     * FROM
     *  myTable
     * ```
     */
    readonly _distinct : DataT["_distinct"];
    /**
     * https://dev.mysql.com/doc/refman/8.0/en/information-functions.html#function_found-rows
     *
     * ```sql
     * SELECT SQL_CALC_FOUND_ROWS
     *  myColumnA,
     *  myColumnB
     * FROM
     *  myTable
     * ```
     *
     * ### Note
     *
     * The `SQL_CALC_FOUND_ROWS` query modifier and accompanying `FOUND_ROWS()` function
     * are deprecated as of MySQL 8.0.17 and will be removed in a future MySQL version.
     *
     * As a replacement, consider executing your query with `LIMIT`,
     * and then a second query with `COUNT(*)` and without `LIMIT` to determine
     * whether there are additional rows.
     *
     * For example, instead of these queries:
     *
     * ```sql
     * SELECT SQL_CALC_FOUND_ROWS * FROM tbl_name WHERE id > 100 LIMIT 10;
     * SELECT FOUND_ROWS();
     * ```
     *
     * Use these queries instead:
     *
     * ```sql
     * SELECT * FROM tbl_name WHERE id > 100 LIMIT 10;
     * SELECT COUNT(*) WHERE id > 100;
     * ```
     *
     * `COUNT(*)` is subject to certain optimizations.
     * `SQL_CALC_FOUND_ROWS` causes some optimizations to be disabled.
     */
    readonly _sqlCalcFoundRows : DataT["_sqlCalcFoundRows"];

    /**
     * The `FROM/JOIN` clause(s) of the query.
     */
    readonly _joins : DataT["_joins"];
    /**
     * The `FROM/JOIN` clause(s) of the "outer"/"parent" query.
     */
    readonly _parentJoins : DataT["_parentJoins"];
    /**
     * The `SELECT` clause.
     */
    readonly _selects : DataT["_selects"];
    /**
     * The `WHERE` clause.
     */
    readonly _where : DataT["_where"];

    /**
     * The `GROUP BY` clause.
     *
     * The columns in the `GROUP BY` clause are
     * properly referred to as "aggregated columns"
     */
    readonly _grouped : DataT["_grouped"];
    /**
     * The `HAVING` clause.
     */
    readonly _having : DataT["_having"];

    /**
     * The `ORDER BY` clause.
     */
    readonly _orders : DataT["_orders"];
    /**
     * The `LIMIT` clause.
     */
    readonly _limit : DataT["_limit"];

    /**
     * The `UNION` clause.
     */
    readonly _unions : DataT["_unions"];
    /**
     * The `ORDER BY` clause after the `UNION` clause.
     */
    readonly _unionOrders : DataT["_unionOrders"];
    /**
     * The `LIMIT` clause after the `UNION` clause.
     */
    readonly _unionLimit : DataT["_unionLimit"];

    /**
     * A delegate that maps the fetched rows into a different shape.
     *
     * You may also run arbitrary queries inside the mapping function.
     *
     * ```ts
     * from(myTable)
     *  .select(columns => [columns])
     *  .map(async ({myTable}, connection) => {
     *      return {
     *          ...myTable,
     *          someOtherValue : await from(otherTable)
     *              .whereEq(columns => columns.otherColumn, myTable.myColumn)
     *              .select(columns => [columns])
     *              .fetchAll(connection),
     *      };
     *  })
     *  .fetchAll(connection);
     * ```
     */
    readonly _mapDelegate : DataT["_mapDelegate"];
}
export type UnmappedFetchRow<QueryT extends QueryUtil.AfterSelectClause> = (
    QueryUtil.UnmappedType<QueryT>
);
export type FetchRow<QueryT extends QueryUtil.AfterSelectClause> = (
    QueryUtil.MappedType<QueryT>
);
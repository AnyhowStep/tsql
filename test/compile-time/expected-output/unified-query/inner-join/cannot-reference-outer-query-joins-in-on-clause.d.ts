/**
 * The following query works on PostgreSQL 9.4, SQLite 3.28.
 * It does not work on MySQL 5.7.
 *
 * ```sql
 *  SELECT
 *      *
 *  FROM
 *      myTable
 *  WHERE
 *      (
 *          SELECT
 *              myTable2.myTable2Id
 *          FROM
 *              myTable2
 *          JOIN
 *              myTable3
 *          ON
 *              myTable3.myTable3Id = myTable.myTableId
 *          LIMIT
 *              1
 *      ) IS NOT NULL
 * ```
 */
import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../dist";
export declare const expr: tsql.ExprImpl<boolean, tsql.IUsedRef<{
    readonly [x: string]: {
        [x: string]: any;
    };
}>, boolean>;
export declare const query: tsql.Query<{
    fromClause: tsql.IFromClause<{
        outerQueryJoins: undefined;
        currentJoins: readonly tsql.Join<{
            tableAlias: "myTable";
            nullable: false;
            columns: {
                readonly myTableId: tsql.Column<{
                    tableAlias: "myTable";
                    columnAlias: "myTableId";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
            };
            originalColumns: {
                readonly myTableId: tsql.Column<{
                    tableAlias: "myTable";
                    columnAlias: "myTableId";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
            };
            primaryKey: undefined;
            candidateKeys: readonly [];
            deleteEnabled: true;
            mutableColumns: readonly [];
        }>[];
    }>;
    selectClause: undefined;
    limitClause: undefined;
    compoundQueryClause: undefined;
    compoundQueryLimitClause: undefined;
    mapDelegate: undefined;
    groupByClause: undefined;
}>;

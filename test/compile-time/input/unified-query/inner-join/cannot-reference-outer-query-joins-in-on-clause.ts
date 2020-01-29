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

const myTable = tsql.table("myTable")
    .addColumns({
        myTableId : tm.mysql.bigIntUnsigned(),
    });

const myTable2 = tsql.table("myTable2")
    .addColumns({
        myTable2Id : tm.mysql.bigIntUnsigned(),
    });

const myTable3 = tsql.table("myTable3")
    .addColumns({
        myTable3Id : tm.mysql.bigIntUnsigned(),
    });

export const expr = tsql.isNotNull(
    tsql.requireOuterQueryJoins(myTable)
        .from(myTable2)
        .select(columns => [columns.myTable2.myTable2Id])
        .limit(1)
        .innerJoin(
            myTable3,
            (columns) => tsql.eq(
                columns.myTable3.myTable3Id,
                columns.myTable.myTableId
            )
        )
);

export const query = tsql
    .from(myTable)
    .where(() => expr);

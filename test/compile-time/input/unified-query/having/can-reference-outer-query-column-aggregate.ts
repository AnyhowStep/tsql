import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../dist";

const myTable = tsql.table("myTable")
    .addColumns({
        myColumn : tm.mysql.bigIntUnsigned(),
    });

const otherTable = tsql.table("otherTable")
    .addColumns({
        otherColumn : tm.mysql.bigIntUnsigned(),
    });

export const query = tsql.requireOuterQueryJoins(otherTable)
    .from(myTable)
    .groupBy(columns => [
        columns.myColumn,
    ])
    /**
     * This sample query shows that this library's
     * compile-time checks are not strong enough yet.
     *
     * -----
     *
     * The following SQL will not run on PostgreSQL and SQLite,
     * ```sql
     *  SELECT
     *      *
     *  FROM
     *      myTable
     *  WHERE
     *      EXISTS (
     *          SELECT
     *              1
     *          FROM
     *              otherTable
     *          GROUP BY
     *              otherTable.otherColumn
     *          HAVING
     *              otherTable.otherColumn = SUM(myTable.myColumn)
     *      )
     * ```
     *
     * But will run fine on MySQL...
     *
     * + This library thinks that `EXISTS()` is not an aggregate function.
     * + This library thinks that subqueries are never aggregate expressions.
     *
     * However, if a subquery uses an aggregate function with **only** outer query columns as arguments,
     * the subquery is **probably** an aggregate expression.
     *
     * -----
     *
     * Changing `otherTable.otherColumn = SUM(myTable.myColumn)` to,
     * `otherTable.otherColumn = SUM(myTable.myColumn+otherTable.otherColumn-otherTable.otherColumn)`
     *
     * will make it run on all three databases...
     *
     * Notice the `+otherColumn-otherColumn` bit effectively makes it a no-op (ignoring overflow).
     *
     * -----
     *
     * The following SQL will not run on MySQL, PostgreSQL and SQLite,
     * ```sql
     *  SELECT
     *      *
     *  FROM
     *      myTable
     *  WHERE
     *      EXISTS (
     *          SELECT
     *              1
     *          FROM
     *              otherTable
     *          GROUP BY
     *              otherTable.otherColumn
     *          HAVING
     *              1 = SUM(otherTable.otherColumn+myTable.myColumn)
     *      )
     * ```
     *
     */
    .having(columns => tsql.nullSafeEq(
        columns.myTable.myColumn,
        tsql.castAsBigIntSigned(
            tsql.integer.sum(columns.otherTable.otherColumn)
        )
    ));

import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../dist";

const myTable = tsql.table("myTable")
    .addColumns({
        myTableId : tm.mysql.bigIntSigned(),
        myColumn : tm.mysql.bigIntSigned(),
        myOtherColumn : tm.mysql.bigIntSigned(),
    });

const otherTable = tsql.table("otherTable")
    .addColumns({
        myTableId : tm.mysql.bigIntSigned(),
        otherColumn : tm.mysql.bigIntSigned(),
    });

export const myQuery = tsql
    .from(myTable)
    .select(columns => [
        tsql.integer.add(
            columns.myColumn,
            32n
        ).as("x")
    ])
    .orderBy((columns, subquery) => [
        //Column
        columns.myTable.myColumn.asc(),
        //Alias in `SELECT` clause
        columns.$aliased.x.asc(),
        //Unaliased expression
        tsql.integer.add(
            columns.myTable.myColumn,
            columns.myTable.myOtherColumn
        ).asc(),
        //Unaliased subquery expression
        /**
         * Testing all the different ways we can use subqueries as sort expressions.
         */
        /*
        At the moment, this is not allowed
        subquery
            .from(otherTable)
            .where(columns => tsql.eq(
                columns.myTable.myTableId,
                columns.otherTable.myTableId
            ))
            .limit(1)
            .select(columns => [columns.otherTable.otherColumn]),
        */
        subquery
            .from(otherTable)
            .where(columns => tsql.eq(
                /**
                 * We now have multiple tables in the `FROM` clause (and outer query `FROM` clause).
                 * So, we must now qualify columns with a table name.
                 */
                columns.myTable.myTableId,
                columns.otherTable.myTableId
            ))
            .limit(1)
            .select(columns => [columns.otherTable.otherColumn])
            .asc(),
        subquery
            .from(otherTable)
            .where(columns => tsql.eq(
                /**
                 * We now have multiple tables in the `FROM` clause (and outer query `FROM` clause).
                 * So, we must now qualify columns with a table name.
                 */
                columns.myTable.myTableId,
                columns.otherTable.myTableId
            ))
            .limit(1)
            .select(columns => [columns.otherTable.otherColumn])
            .desc(),
        subquery
            .from(otherTable)
            .where(columns => tsql.eq(
                /**
                 * We now have multiple tables in the `FROM` clause (and outer query `FROM` clause).
                 * So, we must now qualify columns with a table name.
                 */
                columns.myTable.myTableId,
                columns.otherTable.myTableId
            ))
            .limit(1)
            .select(columns => [columns.otherTable.otherColumn])
            .coalesce(null),
        subquery
            .from(otherTable)
            .where(columns => tsql.eq(
                /**
                 * We now have multiple tables in the `FROM` clause (and outer query `FROM` clause).
                 * So, we must now qualify columns with a table name.
                 */
                columns.myTable.myTableId,
                columns.otherTable.myTableId
            ))
            .limit(1)
            .select(columns => [columns.otherTable.otherColumn])
            .coalesce(null)
            .asc(),
        subquery
            .from(otherTable)
            .where(columns => tsql.eq(
                /**
                 * We now have multiple tables in the `FROM` clause (and outer query `FROM` clause).
                 * So, we must now qualify columns with a table name.
                 */
                columns.myTable.myTableId,
                columns.otherTable.myTableId
            ))
            .limit(1)
            .select(columns => [columns.otherTable.otherColumn])
            .coalesce(null)
            .desc(),
        //Alised subquery expression
        subquery
            .from(otherTable)
            .where(columns => tsql.eq(
                /**
                 * We now have multiple tables in the `FROM` clause (and outer query `FROM` clause).
                 * So, we must now qualify columns with a table name.
                 */
                columns.myTable.myTableId,
                columns.otherTable.myTableId
            ))
            .limit(1)
            .select(columns => [columns.otherTable.otherColumn])
            .as("aliasedSubqueryExpression"),
        subquery
            .from(otherTable)
            .where(columns => tsql.eq(
                /**
                 * We now have multiple tables in the `FROM` clause (and outer query `FROM` clause).
                 * So, we must now qualify columns with a table name.
                 */
                columns.myTable.myTableId,
                columns.otherTable.myTableId
            ))
            .limit(1)
            .select(columns => [columns.otherTable.otherColumn])
            .as("aliasedSubqueryExpression")
            .asc(),
        subquery
            .from(otherTable)
            .where(columns => tsql.eq(
                /**
                 * We now have multiple tables in the `FROM` clause (and outer query `FROM` clause).
                 * So, we must now qualify columns with a table name.
                 */
                columns.myTable.myTableId,
                columns.otherTable.myTableId
            ))
            .limit(1)
            .select(columns => [columns.otherTable.otherColumn])
            .as("aliasedSubqueryExpression")
            .desc(),
    ]);

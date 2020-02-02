import * as tape from "tape";
import * as tm from "type-mapping";
import * as tsql from "../../../../dist";
import {compareSqlPretty} from "../../../compare-sql-pretty";

tape(__filename, t => {
    const outerTable = tsql.table("outerTable")
        .addColumns({
            myBoolColumn : tm.mysql.boolean(),
            myDoubleColumn : tm.mysql.double(),
            myDateTimeColumn : tm.mysql.dateTime(3),
        })
        .setPrimaryKey(columns => [columns.myDoubleColumn, columns.myDateTimeColumn]);

    const myTable = tsql.table("myTable")
        .addColumns({
            myBoolColumn : tm.mysql.boolean(),
            myDoubleColumn : tm.mysql.double(),
            myDateTimeColumn : tm.mysql.dateTime(3),
        });

    const query = tsql
        .requireOuterQueryJoins(myTable)
        .from(outerTable)
        .select(c => [c.myTable.myBoolColumn])
        .whereEqInnerQueryPrimaryKey(
            tables => tables.myTable,
            outerQueryTables => outerQueryTables.outerTable
        );

    compareSqlPretty(__filename, t, query);

    t.end();
});

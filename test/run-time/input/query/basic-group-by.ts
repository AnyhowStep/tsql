import * as tape from "tape";
import * as tm from "type-mapping";
import * as tsql from "../../../../dist";
import {compareSqlPretty} from "../../../compare-sql-pretty";

tape(__filename, t => {
    const myTable = tsql.table("myTable")
        .addColumns({
            myBoolColumn : tm.mysql.boolean(),
        });

    const myTable2 = tsql.table("myTable2")
        .addColumns({
            myDoubleColumn : tm.mysql.double(),
        });

    const myTable3 = tsql.table("myTable3")
        .addColumns({});

    const query = tsql.from(myTable)
        .select(c => [c.myBoolColumn, tsql.pi().as("pi")])
        .crossJoin(myTable2)
        .crossJoin(myTable3)
        .groupBy(columns => [
            columns.myTable.myBoolColumn,
            columns.myTable2.myDoubleColumn,
            columns.__aliased.pi,
        ]);

    compareSqlPretty(__filename, t, query);

    t.end();
});

import * as tape from "tape";
import * as tm from "type-mapping";
import * as tsql from "../../../../../dist";
import {compareSqlPretty} from "../../../../compare-sql-pretty";

tape(__filename, t => {

    const myTable = tsql.table("myTable")
        .addColumns({
            myColumn : tm.mysql.boolean(),
        });

    const query = tsql
        .from(myTable)
        .selectValue(columns => tsql.not(columns.myColumn).as("x"))
        .selectValue(columns => tsql.not(columns.myColumn).as("y"));

    compareSqlPretty(__filename, t, query);

    t.end();
});

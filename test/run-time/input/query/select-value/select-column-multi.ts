import * as tape from "tape";
import * as tm from "type-mapping";
import * as tsql from "../../../../../dist";
import {compareSqlPretty} from "../../../../compare-sql-pretty";

tape(__filename, t => {
    const myTable = tsql.table("myTable")
        .addColumns({
            myColumn : tm.mysql.boolean(),
            myColumn2 : tm.mysql.bigIntUnsigned(),
        });

    const query = tsql
        .from(myTable)
        .selectValue(columns => columns.myColumn2)
        .selectValue(columns => columns.myColumn);

    compareSqlPretty(__filename, t, query);

    t.end();
});

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
        .selectValue(() =>
            tsql.select(() => [tsql.not(true).as("x")])
        );

    compareSqlPretty(__filename, t, query);

    t.end();
});

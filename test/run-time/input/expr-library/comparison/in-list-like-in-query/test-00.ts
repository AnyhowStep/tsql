import * as tm from "type-mapping";
import * as tape from "tape";
import * as tsql from "../../../../../../dist";
import {compareSqlPretty} from "../../../../../compare-sql-pretty";

tape(__filename, t => {
    const myTable = tsql.table("myTable")
        .addColumns({
            myColumn : tm.mysql.double(),
        });
    const expr = tsql.inList(
        3,
        tsql.from(myTable)
            .selectValue(columns => columns.myColumn)
            .limit(0)
            .coalesce(3)
    );

    compareSqlPretty(__filename, t, expr.ast);

    t.end();
});

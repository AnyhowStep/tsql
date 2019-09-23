import * as tm from "type-mapping";
import * as tape from "tape";
import * as tsql from "../../../../../../dist";
import {compareSqlPretty} from "../../../../../compare-sql-pretty";

tape(__filename, t => {
    const myTable = tsql.table("myTable")
        .addColumns({
            myColumn : tm.mysql.double(),
        });
    const expr = tsql.inArray(
        9001,
        [
            tsql.from(myTable)
                .selectValue(columns => columns.myColumn)
                .limit(1)
                .coalesce(0)
        ]
    );

    compareSqlPretty(__filename, t, expr.ast);

    t.end();
});

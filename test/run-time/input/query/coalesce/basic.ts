import * as tape from "tape";
import * as tm from "type-mapping";
import * as tsql from "../../../../../dist";
import {compareSqlPretty} from "../../../../compare-sql-pretty";

tape(__filename, t => {
    const myTable = tsql.table("myTable")
        .addColumns({
            myTableId : tm.mysql.bigIntUnsigned(),
        });

    const expr = tsql.from(myTable)
        .select(c => [c.myTableId])
        .distinct()
        .limit(1)
        .coalesce("someDefaultValue");

    compareSqlPretty(__filename, t, expr.ast);

    t.end();
});

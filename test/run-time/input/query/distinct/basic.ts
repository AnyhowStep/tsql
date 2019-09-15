import * as tape from "tape";
import * as tm from "type-mapping";
import * as tsql from "../../../../../dist";
import {compareSqlPretty} from "../../../../compare-sql-pretty";

tape(__filename, t => {
    const myTable = tsql.table("myTable")
        .addColumns({
            myTableId : tm.mysql.bigIntUnsigned(),
        });

    const query = tsql.from(myTable)
        .select(c => [c])
        .distinct();

    compareSqlPretty(__filename, t, query);

    t.end();
});

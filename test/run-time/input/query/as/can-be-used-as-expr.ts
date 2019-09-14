import * as tape from "tape";
import * as tm from "type-mapping";
import * as tsql from "../../../../../dist";
import {compareSqlPretty} from "../../../../compare-sql-pretty";

tape(__filename, t => {
    const myTable = tsql.table("myTable")
        .addColumns({
            myTableId : tm.mysql.bigIntUnsigned(),
        });

    const aliased = tsql.isNotNull(
        tsql
            .from(myTable)
            .select(c => [c.myTableId])
            .limit(1)
            .as("myAlias")
    );

    compareSqlPretty(__filename, t, aliased.ast);

    t.end();
});

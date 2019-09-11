import * as tape from "tape";
import * as tm from "type-mapping";
import * as tsql from "../../../../dist";
import {compareSqlPretty} from "../../../compare-sql-pretty";

tape(__filename, t => {
    const myTable = tsql.table("myTable")
        .addColumns({
            myBoolColumn : tm.mysql.boolean(),
        });

    const query = tsql.from(myTable)
        .select(c => [c.myBoolColumn])
        .orderBy(c => [
            c.myBoolColumn,
            c.myBoolColumn.asc(),
            c.myBoolColumn.desc(),
            tsql.isNotNull(c.myBoolColumn),
            tsql.isNotNull(c.myBoolColumn).asc(),
            tsql.isNotNull(c.myBoolColumn).desc(),
            tsql.isNotNull(c.myBoolColumn).as("someName"),
            tsql.isNotNull(c.myBoolColumn).as("someName").asc(),
            tsql.isNotNull(c.myBoolColumn).as("someName").desc(),
        ]);

    compareSqlPretty(__filename, t, query);

    t.end();
});

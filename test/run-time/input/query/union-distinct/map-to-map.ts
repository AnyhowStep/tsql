import * as tape from "tape";
import * as tm from "type-mapping";
import * as tsql from "../../../../../dist";
import {compareSqlPretty} from "../../../../compare-sql-pretty";

tape(__filename, t => {
    const myTable = tsql.table("myTable")
        .addColumns({
            udY : tm.mysql.double().orNull(),
            udX : tm.mysql.boolean().orNull(),
            udZ : tm.mysql.dateTime().orNull(),
        });

    const myTable2 = tsql.table("myTable2")
        .addColumns({
            udZ : tm.mysql.dateTime(),
            udY : tm.mysql.double(),
            udX : tm.mysql.boolean(),
        });

    const query = tsql.from(myTable)
        .select(c => [
            c
        ])
        .unionDistinct(
            tsql
                .from(myTable2)
                .select(c => [
                    c
                ])
        );

    compareSqlPretty(__filename, t, query);

    t.end();
});

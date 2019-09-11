import * as tape from "tape";
import * as tm from "type-mapping";
import * as tsql from "../../../../dist";
import {compareSqlPretty} from "../../../compare-sql-pretty";

tape(__filename, t => {
    const myTable = tsql.table("myTable")
        .addColumns({
            b : tm.mysql.boolean(),
            z : tm.mysql.boolean(),
            a : tm.mysql.boolean(),
            x : tm.mysql.boolean(),
            c : tm.mysql.boolean(),
            y : tm.mysql.boolean(),
        });

    const query = tsql.from(myTable)
        .select(c => [c]);

    compareSqlPretty(__filename, t, query);

    t.end();
});

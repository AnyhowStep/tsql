import * as tm from "type-mapping";
import * as tape from "tape";
import * as tsql from "../../../../../../dist";
import {compareSqlPretty} from "../../../../../compare-sql-pretty";

tape(__filename, t => {
    const myTable = tsql.table("myTable")
        .addColumns({
            myColumn : tm.mysql.varChar(),
        });
    const expr = tsql.notLike(
        myTable.columns.myColumn,
        "%D_v_d%",
        "~"
    );

    compareSqlPretty(__filename, t, expr.ast);

    t.end();
});

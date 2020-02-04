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
        "%D?_v?_d%",
        "\\"
    );

    /**
     * @todo Investigate this output.
     * The SQL formatter has a bug in it.
     */
    compareSqlPretty(__filename, t, expr.ast);

    t.end();
});

import * as tape from "tape";
import * as tm from "type-mapping";
import * as tsql from "../../../../../../dist";
import {sqliteSqlfier} from "../../../../../sqlite-sqlfier";

tape(__filename, t => {
    const myTable = tsql.table("myTable")
        .addColumns({
            myColumn : tm.mysql.double(),
        });

    const expr = tsql.double.acos(tsql.coalesce(tsql.double.acos(
        myTable.columns.myColumn
    ), 0));
    t.deepEqual(
        tsql.AstUtil.toSql(expr.ast, sqliteSqlfier),
        `ACOS(COALESCE(ACOS("myTable"."myColumn"), 0e0))`
    );

    t.end();
});

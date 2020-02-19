import * as tape from "tape";
import * as tm from "type-mapping";
import * as tsql from "../../../../../../dist";
import {sqliteSqlfier} from "../../../../../sqlite-sqlfier";

tape(__filename, t => {
    const myTable = tsql.table("myTable")
        .addColumns({
            myColumn : tm.mysql.double(),
        });

    const expr = tsql.double.add(
        myTable.columns.myColumn,
        tsql.coalesce(tsql.double.sub(myTable.columns.myColumn, myTable.columns.myColumn), 1),
        myTable.columns.myColumn
    );
    t.deepEqual(
        tsql.AstUtil.toSql(expr.ast, sqliteSqlfier),
        `("myTable"."myColumn" + COALESCE("myTable"."myColumn" - "myTable"."myColumn", 1e0) + "myTable"."myColumn")`
    );

    t.end();
});

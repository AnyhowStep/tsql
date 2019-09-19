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
        0,
        1,
        -1,
        32
    );
    t.deepEqual(
        tsql.AstUtil.toSql(expr.ast, sqliteSqlfier),
        `("myTable"."myColumn" + 1 + -1 + 32)`
    );

    t.end();
});

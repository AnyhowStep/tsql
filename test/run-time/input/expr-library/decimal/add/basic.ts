import * as tape from "tape";
import * as tsql from "../../../../../../dist";
import {sqliteSqlfier} from "../../../../../sqlite-sqlfier";

tape(__filename, t => {
    const myTable = tsql.table("myTable")
        .addColumns({
            myColumn : tsql.dtDecimal(65, 30),
        });

    const expr = tsql.decimal.add(
        myTable.columns.myColumn
    );
    t.deepEqual(
        tsql.AstUtil.toSql(expr.ast, sqliteSqlfier),
        `"myTable"."myColumn"`
    );

    t.end();
});

import * as tape from "tape";
import * as tm from "type-mapping";
import * as tsql from "../../../../../../dist";

tape(__filename, t => {
    const myTable = tsql.table("myTable")
        .addColumns({
            myColumn : tm.mysql.double(),
        });

    const expr = tsql.acos(tsql.acos(tsql.acos(
        myTable.columns.myColumn
    )));
    t.deepEqual(
        tsql.AstUtil.toSql(expr.ast, tsql.defaultSqlfier),
        `ACOS(ACOS(ACOS("myTable"."myColumn")))`
    );

    t.end();
});

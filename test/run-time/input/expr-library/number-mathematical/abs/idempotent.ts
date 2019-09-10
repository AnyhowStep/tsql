import * as tape from "tape";
import * as tm from "type-mapping";
import * as tsql from "../../../../../../dist";

tape(__filename, t => {
    const myTable = tsql.table("myTable")
        .addColumns({
            myColumn : tm.mysql.double(),
        });

    const expr = tsql.abs(tsql.abs(
        myTable.columns.myColumn
    ));
    t.deepEqual(
        tsql.AstUtil.toSql(expr.ast, tsql.defaultSqlfier),
        `ABS("myTable"."myColumn")`
    );

    t.end();
});

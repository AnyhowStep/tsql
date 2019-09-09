import * as tape from "tape";
import * as tm from "type-mapping";
import * as tsql from "../../../../../../dist";

tape(__filename, t => {
    const myTable = tsql.table("myTable")
        .addColumns({
            myColumn : tm.mysql.double(),
        });

    const expr = tsql.add(
        myTable.columns.myColumn,
        0,
        1,
        -1,
        32
    );
    t.deepEqual(
        tsql.AstUtil.toSql(expr.ast, tsql.defaultSqlfier),
        `("myTable"."myColumn" + 1 + -1 + 32)`
    );

    t.end();
});

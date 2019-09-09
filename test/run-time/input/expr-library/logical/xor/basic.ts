import * as tape from "tape";
import * as tm from "type-mapping";
import * as tsql from "../../../../../../dist";

tape(__filename, t => {
    const myTable = tsql.table("myTable")
        .addColumns({
            myBoolColumn : tm.mysql.boolean(),
        });

    const expr = tsql.xor(
        myTable.columns.myBoolColumn,
        myTable.columns.myBoolColumn
    );
    t.deepEqual(
        tsql.AstUtil.toSql(expr.ast, tsql.defaultSqlfier),
        `("myTable"."myBoolColumn" XOR "myTable"."myBoolColumn")`
    );

    t.end();
});

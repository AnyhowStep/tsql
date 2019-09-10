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
        myTable.columns.myColumn
    );
    t.deepEqual(
        tsql.AstUtil.toSql(expr.ast, tsql.defaultSqlfier),
        `("myTable"."myColumn" + "myTable"."myColumn")`
    );


    const expr2 = tsql.acos(
        expr
    );
    t.deepEqual(
        tsql.AstUtil.toSql(expr2.ast, tsql.defaultSqlfier),
        `ACOS("myTable"."myColumn" + "myTable"."myColumn")`
    );


    t.end();
});

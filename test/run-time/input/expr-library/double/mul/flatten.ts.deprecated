import * as tape from "tape";
import * as tm from "type-mapping";
import * as tsql from "../../../../../../dist";
import {sqliteSqlfier} from "../../../../../sqlite-sqlfier";

tape(__filename, t => {
    const myTable = tsql.table("myTable")
        .addColumns({
            myColumn : tm.mysql.double(),
        });

    const expr = tsql.double.mul(
        myTable.columns.myColumn,
        1,
        tsql.double.mul(
            myTable.columns.myColumn,
            1,
            myTable.columns.myColumn,
            tsql.double.mul(
                myTable.columns.myColumn,
                1,
                myTable.columns.myColumn
            )
        ),
        myTable.columns.myColumn
    );
    t.deepEqual(
        tsql.AstUtil.toSql(expr.ast, sqliteSqlfier),
        `("myTable"."myColumn" * "myTable"."myColumn" * "myTable"."myColumn" * "myTable"."myColumn" * "myTable"."myColumn" * "myTable"."myColumn")`
    );

    t.end();
});

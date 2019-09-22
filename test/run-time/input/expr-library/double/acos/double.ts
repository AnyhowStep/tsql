import * as tape from "tape";
import * as tm from "type-mapping";
import * as tsql from "../../../../../../dist";
import {sqliteSqlfier} from "../../../../../sqlite-sqlfier";

tape(__filename, t => {
    const myTable = tsql.table("myTable")
        .addColumns({
            myColumn : tm.mysql.double(),
        });

    //This is OK, after assigning to a temporary variable
    const tmp = tsql.coalesce(
        tsql.double.acos(myTable.columns.myColumn),
        0
    );
    const expr2 = tsql.double.acos(
        tmp
    );
    expr2;

    //This gives the `Type instantiation is excessively deep and possibly infinite.`
    //error.
    const expr = tsql.double.acos(
        tsql.coalesce(
            tsql.double.acos(myTable.columns.myColumn),
            0
        )
    );
    t.deepEqual(
        tsql.AstUtil.toSql(expr.ast, sqliteSqlfier),
        `ACOS(COALESCE(ACOS("myTable"."myColumn"), 0e0))`
    );

    t.end();
});

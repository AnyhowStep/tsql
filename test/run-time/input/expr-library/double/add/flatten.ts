import * as tape from "tape";
import * as tm from "type-mapping";
import * as tsql from "../../../../../../dist";
import {sqliteSqlfier, THROW_AST} from "../../../../../sqlite-sqlfier";

tape(__filename, t => {
    const myTable = tsql.table("myTable")
        .addColumns({
            myColumn : tm.mysql.double(),
        });

    const expr = tsql.double.add(
        myTable.columns.myColumn,
        0,
        tsql.double.add(
            myTable.columns.myColumn,
            0,
            myTable.columns.myColumn,
            tsql.double.add(
                myTable.columns.myColumn,
                0,
                myTable.columns.myColumn
            )
        ),
        myTable.columns.myColumn
    );
    t.deepEqual(
        tsql.AstUtil.toSql(expr.ast, sqliteSqlfier),
        `COALESCE("myTable"."myColumn" + "myTable"."myColumn" + "myTable"."myColumn" + "myTable"."myColumn" + "myTable"."myColumn" + "myTable"."myColumn", ${THROW_AST})`
    );

    t.end();
});

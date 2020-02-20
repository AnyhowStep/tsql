import * as tape from "tape";
//import * as tm from "type-mapping";
import * as tsql from "../../../../../../dist";
import {sqliteSqlfier, THROW_AST} from "../../../../../sqlite-sqlfier";

tape(__filename, t => {
    const myTable = tsql.table("myTable")
        .addColumns({
            myColumn : tsql.dtDecimal(65, 30),
        });

    const expr = tsql.decimal.add(
        myTable.columns.myColumn,
        tsql.decimalLiteral(0, 65, 30),
        tsql.decimal.add(
            myTable.columns.myColumn,
            tsql.decimalLiteral(0, 65, 30),
            myTable.columns.myColumn,
            tsql.decimal.add(
                myTable.columns.myColumn,
                tsql.decimalLiteral(0, 65, 30),
                tsql.decimal.add(myTable.columns.myColumn),
                myTable.columns.myColumn,
                tsql.decimal.add()
            ),
            tsql.decimal.add(myTable.columns.myColumn),
            tsql.decimal.add()
        ),
        myTable.columns.myColumn
    );
    t.deepEqual(
        tsql.AstUtil.toSql(expr.ast, sqliteSqlfier),
        `COALESCE("myTable"."myColumn" + "myTable"."myColumn" + "myTable"."myColumn" + "myTable"."myColumn" + "myTable"."myColumn" + "myTable"."myColumn" + "myTable"."myColumn" + "myTable"."myColumn", ${THROW_AST})`
    );

    t.end();
});

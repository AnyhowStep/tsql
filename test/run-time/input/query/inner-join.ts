import * as tape from "tape";
import * as tm from "type-mapping";
import * as tsql from "../../../../dist";
import {compareSqlPretty} from "../../../compare-sql-pretty";

tape(__filename, t => {
    const myTable = tsql.table("myTable")
        .addColumns({
            myBoolColumn : tm.mysql.boolean(),
        });

    const myTable2 = tsql.table("myTable2")
        .addColumns({
            column2 : tm.mysql.double(),
        });

    const myTable3 = tsql.table("myTable3")
        .addColumns({
            column3 : tm.mysql.bigIntUnsigned(),
        });

    const query = tsql.from(myTable)
        .select(c => [c.myBoolColumn])
        .innerJoin(
            myTable2,
            columns => tsql.and(
                columns.myTable.myBoolColumn,
                tsql.gt(
                    columns.myTable2.column2,
                    tsql.coalesce(tsql.double.acos(columns.myTable2.column2), 0)
                )
            )
        )
        .innerJoin(
            myTable3,
            columns => tsql.nullSafeEq(
                columns.myTable2.column2,
                tsql.castAsDouble(columns.myTable3.column3)
            )
        )
        .select(c => [c.myTable2.column2]);

    compareSqlPretty(__filename, t, query);

    t.end();
});

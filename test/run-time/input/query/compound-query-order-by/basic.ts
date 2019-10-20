import * as tape from "tape";
import * as tm from "type-mapping";
import * as tsql from "../../../../../dist";
import {compareSqlPretty} from "../../../../compare-sql-pretty";

tape(__filename, t => {
    const myTable = tsql.table("myTable")
        .addColumns({
            myColumn : tm.mysql.bigIntUnsigned(),
        });
    const otherTable = tsql.table("otherTable")
        .addColumns({
            otherColumn : tm.mysql.bigIntUnsigned(),
        });

    const myQuery = tsql
        .from(myTable)
        .select(columns => [
            tsql.integer.add(
                columns.myColumn,
                BigInt(32)
            ).as("x")
        ])
        .unionAll(
            tsql
                .from(otherTable)
                .select(columns => [
                    columns.otherColumn
                ])
        )
        .compoundQueryOrderBy((columns) => [
            //Alias in `SELECT` clause of first query
            columns.x.asc(),
        ]);

    compareSqlPretty(__filename, t, myQuery);

    t.end();
});

import * as tape from "tape";
import * as tm from "type-mapping";
import * as tsql from "../../../../dist";
import {compareSqlPretty} from "../../../compare-sql-pretty";

tape(__filename, t => {
    const myTable = tsql.table("myTable")
        .addColumns({
            ck0 : tm.mysql.bigIntUnsigned(),
            ck1 : tm.mysql.varChar(),
            ck2 : tm.mysql.dateTime(),
        });

    const myTable2 = tsql.table("myTable2")
        .addColumns({
            column2 : tm.mysql.double(),
            ck0 : tm.mysql.bigIntUnsigned(),
            ck1 : tm.mysql.varChar(),
            ck2 : tm.mysql.dateTime(),
        })
        .setPrimaryKey(columns => [columns.ck0]);

    const myTable3 = tsql.table("myTable3")
        .addColumns({
            column3 : tm.mysql.bigIntUnsigned(),
            ck0 : tm.mysql.bigIntUnsigned(),
            ck1 : tm.mysql.varChar(),
            ck2 : tm.mysql.dateTime(),
        })
        .setPrimaryKey(columns => [columns.ck1, columns.ck2]);

    const query = tsql.from(myTable)
        .select(c => [c.ck0])
        .leftJoinUsingPrimaryKey(
            t => t.myTable,
            myTable2
        )
        .leftJoinUsingPrimaryKey(
            t => t.myTable,
            myTable3
        );

    compareSqlPretty(__filename, t, query);

    t.end();
});

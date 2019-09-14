import * as tape from "tape";
import * as tm from "type-mapping";
import * as tsql from "../../../../../dist";
import {compareSqlPretty} from "../../../../compare-sql-pretty";

tape(__filename, t => {
    const myTable = tsql.table("myTable")
        .addColumns({
            myTableId : tm.mysql.bigIntUnsigned(),
        });

    const myTable2 = tsql.table("myTable2")
        .addColumns({
            myTable2Id : tm.mysql.bigIntUnsigned(),
        });

    const myTable3 = tsql.table("myTable3")
        .addColumns({
            myTable3Id : tm.mysql.bigIntUnsigned(),
        });


    const query = tsql.from(myTable)
        .crossJoin(
            tsql
                .from(myTable)
                .select(c => [
                    c.myTableId,
                    tsql.isNotNull(c.myTableId).as("isNotNull")
                ])
                .crossJoin(myTable2)
                .select(c => [
                    c.myTable2
                ])
                .crossJoin(myTable3)
                .select(c => [
                    {
                        myTable3 : c.myTable3,
                    }
                ])
                .as("myAlias")
        )
        .where(c => tsql.and(
            tsql.gt(
                c.myAlias.myTable2Id,
                c.myTable.myTableId
            ),
            c.myAlias.isNotNull
        ))
        .select(c => [
            c
        ]);

    compareSqlPretty(__filename, t, query);

    t.end();
});

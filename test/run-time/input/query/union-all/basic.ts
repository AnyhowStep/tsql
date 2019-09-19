import * as tape from "tape";
import * as tm from "type-mapping";
import * as tsql from "../../../../../dist";
import {compareSqlPretty} from "../../../../compare-sql-pretty";

tape(__filename, t => {
    const myTable = tsql.table("myTable")
        .addColumns({
            myBoolColumn : tm.mysql.boolean(),
            myDoubleColumn : tm.mysql.double(),
        });

    const myTable2 = tsql.table("myTable2")
        .addColumns({
            someOtherColumn : tm.mysql.double(),
        });
    const query = tsql.from(myTable)
        .select(c => [
            c.myBoolColumn,
            c.myDoubleColumn
        ])
        .unionAll(
            tsql
                .from(myTable2)
                .select(c => [
                    tsql.gt(c.someOtherColumn, 0.4).as("gt"),
                    c.someOtherColumn
                ])
        );

    compareSqlPretty(__filename, t, query);

    t.end();
});

import * as tape from "tape";
import * as tm from "type-mapping";
import * as tsql from "../../../../dist";
import {compareSqlPretty} from "../../../compare-sql-pretty";

tape(__filename, t => {
    const myTable = tsql.table("myTable")
        .addColumns({
            myBoolColumn : tm.mysql.boolean(),
            myDoubleColumn : tm.mysql.double(),
            myDateTimeColumn : tm.mysql.dateTime(3),
        });

    const query = tsql.from(myTable)
        .select(c => [c.myBoolColumn])
        .whereEqColumns(
            tables => tables.myTable,
            {
                myDateTimeColumn : new Date("2010-02-03T23:34:45.456Z"),
            }
        )
        .whereEqColumns(
            tables => tables.myTable,
            {
                /**
                 * This column does not belong here!
                 * But it should get ignored.
                 */
                DOES_NOT_EXIST : false,
                myDoubleColumn : 3.141,
            } as any
        );

    compareSqlPretty(__filename, t, query);

    t.end();
});

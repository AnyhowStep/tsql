import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../../dist";

const myTable = tsql.table("myTable")
    .addColumns({
        someColumnA : tm.mysql.boolean().orNull(),
        someColumnB : tm.mysql.varChar().orNull(),
        someColumnC : tm.mysql.varBinary().orNull(),
    })

export const expr0 = tsql.coalesce(
    9001,
    null,
    myTable.columns.someColumnA,
    myTable.columns.someColumnB,
    myTable.columns.someColumnC,
    myTable.columns.someColumnC,
    myTable.columns.someColumnB,
    myTable.columns.someColumnA,
    null
);

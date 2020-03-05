import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../../dist";

const myTable = tsql.table("myTable")
    .addColumns({
        someColumnA : tm.mysql.boolean().orNull(),
        someColumnB : () => Math.random() > 0.5 ? { myCustom : "data type" } as const : null,
        someColumnC : tm.mysql.boolean(),
        someColumnD : () => ({ myCustom : "data type" } as const),
    });

tsql.eq(
    myTable.columns.someColumnC,
    myTable.columns.someColumnA
);
tsql.eq(
    myTable.columns.someColumnC,
    myTable.columns.someColumnC
);
tsql.eq(
    myTable.columns.someColumnD,
    myTable.columns.someColumnB
);
tsql.eq(
    myTable.columns.someColumnD,
    myTable.columns.someColumnD
);

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
    myTable.columns.someColumnA,
    true
);
tsql.eq(
    myTable.columns.someColumnC,
    true
);
tsql.eq(
    myTable.columns.someColumnB,
    tsql.expr(
        {
            mapper : () => ({ myCustom : "data type" } as const),
            usedRef : tsql.UsedRefUtil.fromColumnRef({}),
            isAggregate : false
        },
        ""
    )
);
tsql.eq(
    myTable.columns.someColumnD,
    tsql.expr(
        {
            mapper : () => ({ myCustom : "data type" } as const),
            usedRef : tsql.UsedRefUtil.fromColumnRef({}),
            isAggregate : false
        },
        ""
    )
);

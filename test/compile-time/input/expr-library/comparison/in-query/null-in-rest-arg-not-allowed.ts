import * as tsql from "../../../../../../dist";


const inQueryTableNull = tsql.table("inQueryTableNull")
    .addColumns({
        v : () => 1 as number|null,
    });

const inQueryTableNonNull = tsql.table("inQueryTableNonNull")
    .addColumns({
        v : () => 1,
    });

tsql.inQuery(1, tsql.selectValue(() => null));
tsql.inQuery(1, tsql.from(inQueryTableNull).selectValue(columns => columns.v));
tsql.inQuery(1, tsql
        .from(inQueryTableNonNull)
        .selectValue(columns => columns.v)
        .unionAll(
            tsql.selectValue(() => null)
        )
);

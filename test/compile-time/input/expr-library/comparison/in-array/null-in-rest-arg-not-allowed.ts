import * as tsql from "../../../../../../dist";

tsql.inArray(1, [null]);
tsql.inArray(1, [1, null]);
tsql.inArray(1, [1, null, 2]);
tsql.inArray(1, [1, 2, null]);

const inListTable = tsql.table("inListTable")
    .addColumns({
        v : () => 1,
    });
tsql.inArray(
    1,
    [
        tsql.from(inListTable)
            .selectValue(columns => columns.v)
            .limit(1)
    ]
);

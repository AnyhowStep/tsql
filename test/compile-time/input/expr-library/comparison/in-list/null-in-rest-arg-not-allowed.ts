import * as tsql from "../../../../../../dist";

tsql.inList(1, null);
tsql.inList(1, 1, null);
tsql.inList(1, 1, null, 2);
tsql.inList(1, 1, 2, null);

const inListTable = tsql.table("inListTable")
    .addColumns({
        v : () => 1,
    });
tsql.inList(
    1,
    tsql.from(inListTable)
        .selectValue(columns => columns.v)
        .limit(1)
);

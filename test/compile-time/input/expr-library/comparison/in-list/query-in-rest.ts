import * as tsql from "../../../../../../dist";

const inListTable = tsql.table("inListTable")
    .addColumns({
        v : () => 1,
    });
export const expr0 = tsql.inList(
    1,
    tsql.from(inListTable)
        .selectValue(columns => columns.v)
        .limit(1)
        .coalesce(32),
    tsql.selectValue(() => 54)
);

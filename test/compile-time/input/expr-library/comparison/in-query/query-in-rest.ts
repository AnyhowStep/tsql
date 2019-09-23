import * as tsql from "../../../../../../dist";

const inQueryTable = tsql.table("inQueryTable")
    .addColumns({
        v : () => 1,
    });
export const expr0 = tsql.inQuery(
    1,
    tsql.from(inQueryTable)
        .selectValue(columns => columns.v)
);

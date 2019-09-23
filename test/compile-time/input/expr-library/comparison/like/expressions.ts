import * as tsql from "../../../../../../dist";

const likeTable = tsql.table("likeTable")
    .addColumns({
        v : () => "",
        v2 : () => "",
    });
export const expr0 = tsql.like(
    likeTable.columns.v,
    likeTable.columns.v2,
);

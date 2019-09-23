import * as tm from "type-mapping";
import * as tsql from "../../../../../../dist";

const inListTable = tsql.table("inListTable")
    .addColumns({
        v : tm.mysql.decimal(),
    });
export const expr0 = tsql.inArray(
    tsql.decimalLiteral(3.141, 4, 3),
    [inListTable.columns.v]
);

export const expr1 = tsql.inArray(
    1n,
    [
        3n,
        5n as bigint
    ]
);

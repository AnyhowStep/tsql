import * as tm from "type-mapping";
import * as tsql from "../../../../../../dist";

const inQueryTable0 = tsql.table("inQueryTable0")
    .addColumns({
        v : tm.mysql.decimal(),
    });
export const expr0 = tsql.inQuery(
    tsql.decimalLiteral(3.141, 4, 3),
    tsql.from(inQueryTable0)
        .selectValue(columns => columns.v)
);

const inQueryTable1 = tsql.table("inQueryTable1")
    .addColumns({
        v : tm.mysql.bigIntSigned(),
    });
export const expr1 = tsql.inQuery(
    432n,
    tsql.from(inQueryTable1)
        .selectValue(columns => columns.v)
);

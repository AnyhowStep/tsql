import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../../dist";

const myTable = tsql.table("myTable")
    .addColumns({
        someColumnA : tm.mysql.boolean(),
        someColumnB : tm.mysql.boolean(),
        someColumnC : tm.mysql.boolean(),
    })

export const expr0 = tsql.coalesce(true);
export const expr1 = tsql.coalesce(null);
export const expr2 = tsql.coalesce(null as 1|null);
export const expr3 = tsql.coalesce(myTable.columns.someColumnA);
export const expr4 = tsql.coalesce(
    tsql.and3(
        myTable.columns.someColumnA,
        myTable.columns.someColumnB
    )
);

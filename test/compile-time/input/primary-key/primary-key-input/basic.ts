import * as tm from "type-mapping";
import * as tsql from "../../../../../dist";

const myTable = tsql.table("myTable")
    .addColumns({
        a : tm.mysql.dateTime(),
        b : tm.mysql.float(),
    })
    .setPrimaryKey(c => [c.a, c.b]);

declare function foo () : tsql.PrimaryKey_Input<typeof myTable>;
export const k = foo();

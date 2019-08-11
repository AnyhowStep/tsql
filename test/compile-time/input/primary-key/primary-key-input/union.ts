import * as tm from "type-mapping";
import * as tsql from "../../../../../dist";

const myTable = tsql.table("myTable")
    .addColumns({
        a : tm.mysql.dateTime(),
        b : tm.mysql.float(),
    })
    .setPrimaryKey(c => [c.a, c.b]);

const otherTable = tsql.table("otherTable")
    .addColumns({
        x : tm.mysql.boolean(),
        y : tm.mysql.bigIntUnsigned(),
    })
    .setPrimaryKey(c => [c.x, c.y]);

declare function foo () : tsql.PrimaryKey_Input<typeof myTable|typeof otherTable>;
export const k = foo();

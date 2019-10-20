import * as tape from "tape";
import * as tm from "type-mapping";
import * as tsql from "../../../../../dist";

tape(__filename, t => {
    const myTable = tsql.table("myTable")
        .addColumns({
            myBoolColumn : tm.mysql.boolean(),
        });

    t.throws(() => {
        tsql.from(myTable)
            .select(c => [c.myBoolColumn])
            .limit(1e300);
    });

    t.end();
});

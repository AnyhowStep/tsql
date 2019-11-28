import * as tape from "tape";
import * as tm from "type-mapping";
import * as tsql from "../../../../../dist";

tape(__filename, t => {
    const myTable = tsql.table("myTable")
        .addColumns({
            myTableId : tm.mysql.bigIntUnsigned(),
        });

    t.true(
        tsql.RawExprUtil.isAnyNonValueExpr(
            tsql
                .from(myTable)
                .select(c => [
                    c.myTableId
                ])
                .limit(1)
                .as("q")
        )
    );

    t.end();
});

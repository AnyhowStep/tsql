import * as tape from "tape";
import * as tm from "type-mapping";
import * as tsql from "../../../../../dist";

tape(__filename, t => {
    const myTable = tsql.table("myTable")
        .addColumns({
            myTableId : tm.mysql.bigIntUnsigned(),
        });

    t.true(
        tsql.RawExprUtil.isAnyNonPrimitiveRawExpr(
            tsql.integer.add(
                myTable.columns.myTableId,
                BigInt(0)
            ).as("x")
        )
    );

    t.end();
});

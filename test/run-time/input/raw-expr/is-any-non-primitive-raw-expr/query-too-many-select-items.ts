import * as tape from "tape";
import * as tm from "type-mapping";
import * as tsql from "../../../../../dist";

tape(__filename, t => {
    const myTable = tsql.table("myTable")
        .addColumns({
            myTableId : tm.mysql.bigIntUnsigned(),
        });

    const somethingElse = tsql.table("somethingElse")
        .addColumns({
            boop : tm.mysql.bigIntUnsigned(),
        });

    t.false(
        tsql.RawExprUtil.isAnyNonPrimitiveRawExpr(
            tsql
                .requireOuterQueryJoins(somethingElse)
                .from(myTable)
                .select(c => [
                    tsql.gt(
                        c.myTable.myTableId,
                        c.somethingElse.boop
                    ).as("result"),
                    tsql.gt(
                        c.myTable.myTableId,
                        c.somethingElse.boop
                    ).as("result2")
                ])
                .limit(1)
        )
    );

    t.end();
});

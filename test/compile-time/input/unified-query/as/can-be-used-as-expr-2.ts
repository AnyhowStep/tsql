import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../dist";

const myTable = tsql.table("myTable")
    .addColumns({
        myTableId : tm.mysql.bigIntUnsigned(),
    });

const somethingElse = tsql.table("somethingElse")
    .addColumns({
        boop : tm.mysql.bigIntUnsigned(),
    });

export const aliased = tsql.isNotNull(
    tsql
        .requireOuterQueryJoins(somethingElse)
        .from(myTable)
        .select(c => [
            tsql.gt(
                c.myTable.myTableId,
                c.somethingElse.boop
            ).as("result")
        ])
        .limit(1)
        .as("myAlias")
);

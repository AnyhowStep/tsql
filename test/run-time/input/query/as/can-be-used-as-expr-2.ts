import * as tape from "tape";
import * as tm from "type-mapping";
import * as tsql from "../../../../../dist";
import {compareSqlPretty} from "../../../../compare-sql-pretty";

tape(__filename, t => {
    const myTable = tsql.table("myTable")
        .addColumns({
            myTableId : tm.mysql.bigIntUnsigned(),
        });

    const somethingElse = tsql.table("somethingElse")
        .addColumns({
            boop : tm.mysql.bigIntUnsigned(),
        });

    const aliased = tsql.isNotNull(
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

    compareSqlPretty(__filename, t, aliased.ast);

    t.end();
});

import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../dist";

const myTable = tsql.table("myTable")
    .addColumns({
        myTableId : tm.mysql.bigIntUnsigned(),
    });

export const aliased = tsql.isNotNull(
    tsql
        .from(myTable)
        .select(c => [c.myTableId])
        .limit(1)
        .as("myAlias")
);

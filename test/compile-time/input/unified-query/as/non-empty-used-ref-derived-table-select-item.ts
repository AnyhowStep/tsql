import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../dist";

const myTable = tsql.table("myTable")
    .addColumns({
        myTableId : tm.mysql.bigIntUnsigned(),
    });

const outerQueryOfAs = tsql.table("outerQueryOfAs")
    .addColumns({
        someColumnOfAs : tm.mysql.varChar(),
    });

export const aliased = tsql.requireOuterQueryJoins(outerQueryOfAs)
    .from(myTable)
    .select(c => [c.myTable.myTableId])
    .limit(1)
    .as("myAlias");

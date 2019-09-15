import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../dist";

const myTable = tsql.table("myTable")
    .addColumns({
        myTableId : tm.mysql.bigIntUnsigned(),
    });

const myTable2 = tsql.table("myTable2")
    .addColumns({
        myTable2Id : tm.mysql.bigIntUnsigned(),
    });

export const correlated = tsql
    .requireOuterQueryJoins(myTable)
    .from(myTable2)
    .correlate();

import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../dist";

const myTable = tsql.table("myTable")
    .addColumns({
        myTableId : tm.mysql.bigIntSigned(),
        myColumn : tm.mysql.bigIntSigned(),
        myOtherColumn : tm.mysql.bigIntSigned(),
    });

const otherTable = tsql.table("otherTable")
    .addColumns({
        otherTableId : tm.mysql.bigIntSigned(),
    });

tsql
    .requireOuterQueryJoins(otherTable)
    .from(myTable)
    .orderBy(() => [
        otherTable.columns.otherTableId,
    ]);

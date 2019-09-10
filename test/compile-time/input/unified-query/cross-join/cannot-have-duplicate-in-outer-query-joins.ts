import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../dist";

const myTable = tsql.table("myTable")
    .addColumns({
        myTableId : tm.mysql.bigIntUnsigned(),
    });

const myOtherTable = tsql.table("myOtherTable")
    .addColumns({
        myOtherTableId : tm.mysql.bigIntUnsigned(),
    });

tsql.QueryUtil.newInstance()
    .requireOuterQueryJoins(myOtherTable)
    .from(myTable)
    .crossJoin(myOtherTable);

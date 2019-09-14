import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../dist";

const myTable = tsql.table("myTable")
    .addColumns({
        myTableId : tm.mysql.bigIntUnsigned(),
    });

const myTable2 = tsql.table("myTable2")
    .addColumns({
        blah : tm.mysql.bigIntUnsigned(),
    });

const myTable3 = tsql.table("myTable3")
    .addColumns({
        myTableId : tm.mysql.bigIntUnsigned(),
    });

tsql.QueryUtil.newInstance()
    .from(myTable)
    .crossJoin(myTable2)
    .select(c => [c])
    .crossJoin(myTable3)
    .select(c => [c.myTable3])
    .as("myAlias");

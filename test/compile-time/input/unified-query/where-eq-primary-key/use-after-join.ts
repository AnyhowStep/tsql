import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../dist";

const myTable = tsql.table("myTable")
    .addColumns({
        myTableIdA : tm.mysql.bigIntUnsigned(),
        myTableIdB : tm.mysql.boolean(),
        otherColumn : tm.mysql.varChar(),
    })
    .setPrimaryKey(c => [c.myTableIdA, c.myTableIdB]);

const myOtherTable = tsql.table("myOtherTable")
    .addColumns({
        myOtherTableIdA : tm.mysql.bigIntUnsigned(),
        myOtherTableIdB : tm.mysql.boolean(),
        otherColumn : tm.mysql.varChar(),
    })
    .setPrimaryKey(c => [c.myOtherTableIdA, c.myOtherTableIdB]);

export const query = tsql.QueryUtil.newInstance()
    .from(myTable)
    .crossJoin(myOtherTable)
    .whereEqPrimaryKey(
        tables => tables.myTable,
        {
            myTableIdA : 1n,
            myTableIdB : false,
        }
    );

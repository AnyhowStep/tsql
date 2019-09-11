import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../dist";

const myTable = tsql.table("myTable")
    .addColumns({
        myTableIdA : tm.mysql.bigIntUnsigned(),
        myTableIdB : tm.mysql.boolean(),
        otherColumn : tm.mysql.varChar(),
    })
    .setPrimaryKey(c => [c.myTableIdA, c.myTableIdB]);

export const query = tsql.QueryUtil.newInstance()
    .from(myTable)
    .whereEqPrimaryKey(
        tables => tables.myTable,
        {
            myTableIdA : 1n,
            myTableIdB : false,
        }
    );

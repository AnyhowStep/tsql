import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../dist";

const myTable = tsql.table("myTable")
    .addColumns({
        myTableIdA : tm.mysql.bigIntUnsigned(),
        myTableIdB : tm.mysql.boolean(),
        otherColumn : tm.mysql.varChar(),
    })
    .setPrimaryKey(c => [c.myTableIdA, c.myTableIdB])
    .addCandidateKey(c => [c.myTableIdA, c.otherColumn]);

export const query = tsql.QueryUtil.newInstance()
    .from(myTable)
    .whereEqCandidateKey(
        tables => tables.myTable,
        //Primary keys are candidate keys
        {
            myTableIdA : 1n,
            myTableIdB : false,
        }
    )
    .whereEqCandidateKey(
        tables => tables.myTable,
        //Just a regular candidate key
        {
            myTableIdA : 1n,
            otherColumn : "hey",
        }
    );

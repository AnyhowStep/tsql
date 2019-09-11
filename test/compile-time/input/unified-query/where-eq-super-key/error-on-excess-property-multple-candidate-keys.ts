import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../dist";

const myTable = tsql.table("myTable")
    .addColumns({
        myTableIdA : tm.mysql.bigIntUnsigned(),
        myTableIdB : tm.mysql.boolean(),
        otherColumn : tm.mysql.varChar(),
    })
    .addCandidateKey(c => [c.myTableIdA, c.myTableIdB])
    .addCandidateKey(c => [c.myTableIdA, c.otherColumn]);

export const query = tsql.QueryUtil.newInstance()
    .from(myTable)
    .whereEqSuperKey(
        tables => tables.myTable,
        {
            myTableIdA : 1n,
            myTableIdB : false,
            doesNotExist : "hi",
        }
    );

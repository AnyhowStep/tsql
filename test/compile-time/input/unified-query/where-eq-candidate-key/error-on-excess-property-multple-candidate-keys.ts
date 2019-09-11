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
    .whereEqCandidateKey(
        tables => tables.myTable,
        //https://github.com/microsoft/TypeScript/issues/20863#issuecomment-520303071
        //https://github.com/microsoft/TypeScript/issues/20863#issuecomment-479471546
        {
            myTableIdA : 1n,
            myTableIdB : false,
            otherColumn : "hi",
        }
    );

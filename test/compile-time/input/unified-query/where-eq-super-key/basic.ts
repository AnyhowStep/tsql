import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../dist";

const myTable = tsql.table("myTable")
    .addColumns({
        myTableIdA : tm.mysql.bigIntUnsigned(),
        myTableIdB : tm.mysql.boolean(),
        otherColumn : tm.mysql.varChar(),
        nonKey0 : tm.mysql.dateTime(3),
        nonKey1 : tm.mysql.double(),
    })
    .setPrimaryKey(c => [c.myTableIdA, c.myTableIdB])
    .addCandidateKey(c => [c.myTableIdA, c.otherColumn]);

export const query = tsql.QueryUtil.newInstance()
    .from(myTable)
    .whereEqSuperKey(
        tables => tables.myTable,
        //Primary keys are candidate keys
        {
            myTableIdA : 1n,
            myTableIdB : false,
        }
    )
    .whereEqSuperKey(
        tables => tables.myTable,
        //Just a regular candidate key
        {
            myTableIdA : 1n,
            otherColumn : "hey",
        }
    )
    .whereEqSuperKey(
        tables => tables.myTable,
        //This is a super key because `nonKey0` is not a column of the key
        {
            myTableIdA : 1n,
            myTableIdB : false,
            nonKey0 : new Date(),
        }
    )
    .whereEqSuperKey(
        tables => tables.myTable,
        //This is a super key because `nonKey0` is not a column of the key
        {
            myTableIdA : 1n,
            otherColumn : "hey",
            nonKey0 : new Date(),
        }
    )
    .whereEqSuperKey(
        tables => tables.myTable,
        //This is a super key.
        //The two candidate keys are actually sub keys of this.
        {
            myTableIdA : 1n,
            myTableIdB : false,
            otherColumn : "hey",
        }
    );

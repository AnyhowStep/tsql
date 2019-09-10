import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../dist";

const myTable = tsql.table("myTable")
    .addColumns({
        myTableId : tm.mysql.bigIntUnsigned(),
        myOtherTableId : tm.mysql.bigIntUnsigned(),
    });

const myOtherTable = tsql.table("myOtherTable")
    .addColumns({
        myOtherTableId : tm.mysql.bigIntUnsigned(),
        myTableId : tm.mysql.bigIntUnsigned(),
    })
    .addCandidateKey(columns => [columns.myOtherTableId])
    .addCandidateKey(columns => [columns.myTableId]);

export const query = tsql.QueryUtil.newInstance()
    .from(myTable)
    .innerJoinUsingCandidateKey(
        tables => tables.myTable,
        myOtherTable,
        columns => [columns.myOtherTableId]
    );

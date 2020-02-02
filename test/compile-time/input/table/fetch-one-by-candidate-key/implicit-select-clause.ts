import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../dist";

const myTable = tsql.table("myTable")
    .addColumns({
        myTableId : tm.mysql.bigIntSigned(),
        /**
         * Comment
         */
        createdAt : tm.mysql.dateTime(),
    })
    .setPrimaryKey(columns => [columns.myTableId]);

export const fetchedRow = myTable
    .whereEqCandidateKey({
        myTableId : BigInt(1),
    })
    .fetchOne(
        null as any
    );

import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../dist";

const myTable = tsql.table("myTable")
    .addColumns({
        myTableId : tm.mysql.bigIntSigned(),
        createdAt : tm.mysql.dateTime(),
    })
    .setPrimaryKey(columns => [columns.myTableId]);

export const fetchedRow0 = myTable.fetchOneByCandidateKey(
    null as any,
    {
        myTableId : BigInt(1),
        createdAt : new Date(),
    }
);

export const fetchedRow1 = myTable.fetchOneByCandidateKey(
    null as any,
    {
        myTableId : BigInt(1),
        createdAt : new Date(),
    } as {
        myTableId : bigint,
        createdAt : Date,
    }
);

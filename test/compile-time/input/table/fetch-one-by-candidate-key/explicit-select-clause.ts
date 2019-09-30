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
    },
    columns => [columns]
);

export const fetchedRow1 = myTable.fetchOneByCandidateKey(
    null as any,
    {
        myTableId : BigInt(1),
    },
    columns => [columns.myTableId]
);

export const fetchedRow2 = myTable.fetchOneByCandidateKey(
    null as any,
    {
        myTableId : BigInt(1),
    },
    columns => [columns.createdAt]
);

export const fetchedRow3 = myTable.fetchOneByCandidateKey(
    null as any,
    {
        myTableId : BigInt(1),
    },
    columns => [columns.createdAt, columns.myTableId]
);

export const fetchedRow4 = myTable.fetchOneByCandidateKey(
    null as any,
    {
        myTableId : BigInt(1),
    },
    columns => [
        columns.createdAt,
        columns.myTableId,
        tsql.timestampAddDay(columns.createdAt, BigInt(1)).as("dayAfterCreation")
    ]
);

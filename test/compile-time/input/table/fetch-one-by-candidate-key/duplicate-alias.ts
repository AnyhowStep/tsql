import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../dist";

const myTable = tsql.table("myTable")
    .addColumns({
        myTableId : tm.mysql.bigIntSigned(),
        createdAt : tm.mysql.dateTime(),
    })
    .setPrimaryKey(columns => [columns.myTableId]);

export const fetchedRow0 = myTable
    .whereEqCandidateKey({
        myTableId : BigInt(1),
    })
    .fetchOne(
        null as any,
        columns => [
            columns.createdAt,
            columns.myTableId,
            tsql.timestampAddDay(columns.createdAt, BigInt(1)).as("createdAt")
        ]
    );

export const fetchedRow1 = myTable
    .whereEqCandidateKey({
        myTableId : BigInt(1),
    })
    .fetchOne(
        null as any,
        columns => [
            columns.createdAt,
            columns.myTableId,
            tsql.timestampAddDay(columns.createdAt, BigInt(1)).as("myTableId")
        ]
    );

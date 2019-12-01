import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../dist";

const test = tsql.table("test")
    .addColumns({
        testId : tm.mysql.bigIntUnsigned(),
        testVal : tm.mysql.bigIntUnsigned(),
    })
    .setPrimaryKey(columns => [columns.testId])
    .addCandidateKey(columns => [columns.testVal])
    .addGenerated(columns => [columns.testId])
    .addExplicitDefaultValue(columns => [
        columns.testVal,
    ]);

export const p = test.insertAndFetch(
    null as any,
    {
        /**
         * Should not be allowed because `testId` is a `GENERATED` column
         */
        testId : 1n,
    }
);

export const p2 = test.insertAndFetch(
    null as any,
    {
        testVal : 1n,
    }
);

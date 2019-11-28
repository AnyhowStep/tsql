import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../dist";

const dst = tsql.table("dst")
    .addColumns({
        testId : tm.mysql.bigIntUnsigned(),
        testVal : tm.mysql.bigIntUnsigned().orNull(),
    })
    .setPrimaryKey(columns => [columns.testId])
    .addMutable(columns => [
        columns.testVal,
    ]);
export const p = dst.updateAndFetchOneByCandidateKey(
    null as any,
    {
        testId : BigInt(1),
    },
    () => {
        return Math.random() > 0.5 ?
            {
                testVal : undefined,
            } :
            {
                testVal : null,
            };
    }
);

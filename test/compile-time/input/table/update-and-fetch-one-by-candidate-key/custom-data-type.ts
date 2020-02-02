import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../dist";

const dst = tsql.table("dst")
    .addColumns({
        testId : tm.mysql.bigIntUnsigned(),
        testVal : () => {
            return {
                x : 1,
                y : 2,
            };
        },
    })
    .setPrimaryKey(columns => [columns.testId])
    .addMutable(columns => [
        columns.testVal,
    ]);
export const p = dst.whereEqCandidateKey({
        testId : BigInt(1),
    }).updateAndFetchOne(null as any, () => {
        return {
            testVal : {
                x : 1,
                y : 2,
            },
        };
    }
);

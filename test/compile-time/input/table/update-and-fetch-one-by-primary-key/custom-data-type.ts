import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../dist";

const dst = tsql.table("dst")
    .addColumns({
        testId : tm.mysql.bigIntUnsigned(),
        testVal : () => {
            return {
                x : 1,
                y : 2,
            } as { x : number, y : number }|null;
        },
    })
    .setPrimaryKey(columns => [columns.testId])
    .addMutable(columns => [
        columns.testId,
        columns.testVal,
    ]);
export const p = dst.updateAndFetchOneByPrimaryKey(
    null as any,
    {
        testId : BigInt(1),
    },
    () => {
        return {
            testVal : {
                x : 1,
                y : 2,
            },
        };
    }
);

export const p2 = dst.updateAndFetchOneByPrimaryKey(
    null as any,
    {
        testId : BigInt(1),
    },
    () => {
        return {
            testId : 3n as const,
            testVal : null,
        };
    }
);

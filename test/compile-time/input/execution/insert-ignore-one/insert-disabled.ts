import * as tm from "type-mapping";
import * as tsql from "../../../../../dist";

const test = tsql.table("test")
    .addColumns({
        testId : tm.mysql.bigIntUnsigned(),
        testVal : tm.mysql.bigIntUnsigned(),
    })
    .disableInsert();

export const p = tsql.ExecutionUtil.insertIgnoreOne(
    test,
    null as any,
    {
        testId : BigInt(5),
        testVal : BigInt(400),
    }
);

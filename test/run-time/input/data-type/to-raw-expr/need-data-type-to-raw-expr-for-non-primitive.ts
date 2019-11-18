import * as tape from "tape";
import * as tsql from "../../../../../dist";

tape(__filename, async (t) => {
    t.throws(() => {
        tsql.DataTypeUtil.toRawExpr(
            () => ({ x : "hi" }),
            { x : "hi" }
        )
    });

    t.end();
});

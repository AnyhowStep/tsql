import * as tape from "tape";
//import * as tm from "type-mapping";
import * as tsql from "../../../../../dist";

tape(__filename, t => {
    t.deepEqual(

        {
            ...tsql.BuiltInExprUtil.usedRef(
                Buffer.from("hello, world")
            ),
            __contravarianceMarker : undefined,
        },
        {
            ...tsql.UsedRefUtil.fromColumnMap({}),
            __contravarianceMarker : undefined,
        }
    );
    t.deepEqual(
        {
            ...tsql.BuiltInExprUtil.usedRef(
                new Uint8Array([1,2,3,4])
            ),
            __contravarianceMarker : undefined,
        },
        {
            ...tsql.UsedRefUtil.fromColumnMap({}),
            __contravarianceMarker : undefined,
        }
    );
    t.end();
});

import * as tape from "tape";
//import * as tm from "type-mapping";
import * as tsql from "../../../../../dist";

tape(__filename, t => {
    const values = [
        0, 1, 2, -1, -2, 3.141, -3.141,
        BigInt(0), BigInt(1), BigInt(2), BigInt(-1), BigInt(-2),
        "0", "-1", "-2", "1", "2",
        "hi", "",
        Buffer.from(""),
        Buffer.from("hi"),
        Buffer.from("0"), Buffer.from("1"), Buffer.from("2"), Buffer.from("-1"),Buffer.from("-2"),
        new Uint8Array([]),
        new Uint8Array([0]),
        new Uint8Array([1]),
        new Uint8Array([2]),
        new Uint8Array([0,1,2,3]),
        new Date(0), new Date(1), new Date(2), new Date(-1), new Date(-2),
        //null,
    ];
    for (let i=0; i<=values.length; ++i) {
        const arr = values.slice(0, i);
        for (let j=0; j<=arr.length; ++j) {
            const arr2 = arr.slice();
            arr2.splice(j, 0, { x : "custom type" } as any);
            t.false(
                tsql.BuiltInValueExprArrayUtil.isBuiltInValueExprArray(
                    arr2
                )
            );
        }
    }

    t.end();
});

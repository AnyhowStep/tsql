function bigIntToString (this : { __value : string }) {
    return this.__value;
}
(global as any).BigInt = ((value : string|number|bigint) => {
    return {
        __value : value.toString(),
        toString : bigIntToString,
    };
}) as any;
(BigInt as any).prototype = {
    valueOf : (mixed : unknown) => {
        return BigInt(mixed);
    },
};

import * as tape from "tape";
import * as tm from "type-mapping";

tape(__filename, t => {
    t.false(tm.TypeUtil.isBigIntNativelySupported());
    t.end();
});

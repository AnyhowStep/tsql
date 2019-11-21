import * as tm from "type-mapping";
import * as tsql from "../../../dist";

export const dtPoint = tsql.DataTypeUtil.makeDataType(
    tm.object({
        x : tm.finiteNumber(),
        y : tm.finiteNumber(),
    }),
    value => JSON.stringify(value) as any,
    (a, b) => {
        return (
            a.x === b.x &&
            a.y === b.y
        );
    }
);

import * as tm from "type-mapping";
import * as tsql from "../../../dist";

export const dtPoint = tsql.DataTypeUtil.makeDataType(
    tm.object({
        x : tm.finiteNumber(),
        y : tm.finiteNumber(),
    }),
    value => tsql.expr(
        {
            mapper : tm.object({
                x : tm.finiteNumber(),
                y : tm.finiteNumber(),
            }),
            usedRef : tsql.UsedRefUtil.fromColumnRef({}),
            isAggregate : false,
        },
        tsql.LiteralValueNodeUtil.stringLiteralNode(
            JSON.stringify(value)
        )
    ),
    (a, b) => {
        return (
            a.x === b.x &&
            a.y === b.y
        );
    }
);

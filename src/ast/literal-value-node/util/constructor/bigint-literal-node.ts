import {LiteralValueType, BigIntSignedLiteralNode, BigIntUnsignedLiteralNode} from "../../literal-value-node";
import * as tm from "type-mapping";

export function bigIntLiteralNode (
    literalValue : bigint
) : BigIntSignedLiteralNode|BigIntUnsignedLiteralNode {
    const BigInt = tm.TypeUtil.getBigIntFactoryFunctionOrError();

    if (
        //bigint signed minimum value
        tm.BigIntUtil.greaterThanOrEqual(literalValue, BigInt("-9223372036854775808")) &&
        //bigint signed maximum value
        tm.BigIntUtil.lessThanOrEqual(literalValue, BigInt("9223372036854775807"))
    ) {
        return {
            type : "LiteralValue",
            literalValueType : LiteralValueType.BIGINT_SIGNED,
            literalValue,
        };
    } else if (
        //bigint signed maximum value + 1
        tm.BigIntUtil.greaterThanOrEqual(literalValue, BigInt("9223372036854775808")) &&
        //bigint unsigned maximum value
        tm.BigIntUtil.lessThanOrEqual(literalValue, BigInt("18446744073709551615"))
    ) {
        return {
            type : "LiteralValue",
            literalValueType : LiteralValueType.BIGINT_UNSIGNED,
            literalValue,
        };
    } else {
        //Can only really be a `DECIMAL` value
        throw new Error(`Literal value is too large to be a signed or unsigned bigint; consider using DECIMAL`);
    }
}

import {LiteralValueType, BigIntSignedLiteralNode} from "../../literal-value-node";
import * as tm from "type-mapping";

export function isSignedBigInt (x : bigint) : boolean {
    const BigInt = tm.TypeUtil.getBigIntFactoryFunctionOrError();
    return (
        //bigint signed minimum value
        tm.BigIntUtil.greaterThanOrEqual(x, BigInt("-9223372036854775808")) &&
        //bigint signed maximum value
        tm.BigIntUtil.lessThanOrEqual(x, BigInt("9223372036854775807"))
    );
}
/**
 * @todo Remove
 * @deprecated
 */
export function isUnsignedBigInt (x : bigint) : boolean {
    const BigInt = tm.TypeUtil.getBigIntFactoryFunctionOrError();
    return (
        //bigint unsigned minimum value
        tm.BigIntUtil.greaterThanOrEqual(x, BigInt("0")) &&
        //bigint unsigned maximum value
        tm.BigIntUtil.lessThanOrEqual(x, BigInt("18446744073709551615"))
    );
}

export function isSignedBigIntLiteral (x : bigint) : boolean {
    return isSignedBigInt(x);
}

/**
 * @todo Remove
 * @deprecated
 */
export function isUnsignedBigIntLiteral (x : bigint) : boolean {
    const BigInt = tm.TypeUtil.getBigIntFactoryFunctionOrError();
    return (
        //bigint signed maximum value + 1
        tm.BigIntUtil.greaterThanOrEqual(x, BigInt("9223372036854775808")) &&
        //bigint unsigned maximum value
        tm.BigIntUtil.lessThanOrEqual(x, BigInt("18446744073709551615"))
    );
}

export function signedBigIntLiteralNode (literalValue : bigint) : BigIntSignedLiteralNode {
    if (isSignedBigIntLiteral(literalValue)) {
        return {
            type : "LiteralValue",
            literalValueType : LiteralValueType.BIGINT_SIGNED,
            literalValue,
        };
    }  else {
        //Can only really be an `UNSIGNED BIGINT` or `DECIMAL` value
        throw new Error(`Literal value is too small/large to be a signed bigint; consider using UNSIGNED BIGINT or DECIMAL`);
    }
}

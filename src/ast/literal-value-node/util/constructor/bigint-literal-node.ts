import {LiteralValueType, BigIntSignedLiteralNode, BigIntUnsignedLiteralNode} from "../../literal-value-node";
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

/**
 * @todo standardize if I want to call it `BIGINT UNSIGNED` or `UNSIGNED BIGINT`.
 * My inconsistency is annoying me.
 */
export function unsignedBigIntLiteralNode (literalValue : bigint) : BigIntUnsignedLiteralNode {
    if (isUnsignedBigInt(literalValue)) {
        return {
            type : "LiteralValue",
            literalValueType : LiteralValueType.BIGINT_UNSIGNED,
            literalValue,
        };
    }  else {
        //Can only really be an `SIGNED BIGINT` or `DECIMAL` value
        throw new Error(`Literal value is too small/large to be a unsigned bigint; consider using SIGNED BIGINT or DECIMAL`);
    }
}

export function bigIntLiteralNode (
    literalValue : bigint
) : BigIntSignedLiteralNode|BigIntUnsignedLiteralNode {
    if (isSignedBigIntLiteral(literalValue)) {
        return {
            type : "LiteralValue",
            literalValueType : LiteralValueType.BIGINT_SIGNED,
            literalValue,
        };
    } else if (isUnsignedBigIntLiteral(literalValue)) {
        return {
            type : "LiteralValue",
            literalValueType : LiteralValueType.BIGINT_UNSIGNED,
            literalValue,
        };
    } else {
        //Can only really be a `DECIMAL` value
        throw new Error(`Literal value is too small/large to be a signed or unsigned bigint; consider using DECIMAL`);
    }
}

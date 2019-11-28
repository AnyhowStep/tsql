//import {BuiltInValueExpr} from "../../built-in-value-expr";
//import * as tm from "type-mapping";

export enum LiteralValueType {
    /**
     * Can only be created using the `decimalLiteral()` function
     */
    DECIMAL = "DECIMAL",

    /**
     * ```ts
     * typeof x == "string"
     * ```
     */
    STRING = "STRING",

    /**
     * ```ts
     * typeof x == "number"
     * ```
     */
    DOUBLE = "DOUBLE",

    /**
     * ```ts
     * tm.TypeUtil.isBigInt(x) &&
     * //bigint signed minimum value
     * tm.BigIntUtil.greaterThanOrEqual(x, BigInt("-9223372036854775808")) &&
     * //bigint signed maximum value
     * tm.BigIntUtil.lessThanOrEqual(x, BigInt("9223372036854775807"))
     * ```
     */
    BIGINT_SIGNED = "BIGINT_SIGNED",

    /**
     * ```ts
     * typeof x == "boolean"
     * ```
     */
    BOOLEAN = "BOOLEAN",

    /**
     * An unsigned char array (8-bit unsigned integer)
     * ```ts
     * x instanceof Uint8Array
     * ```
     * @todo Rename this to `UINT8ARRAY`?
     */
    BUFFER = "BUFFER",

    /**
     * ```ts
     * x === null
     * ```
     */
    NULL = "NULL",

    /**
     * ```ts
     * DateUtil.isDate(x)
     * ```
     */
    DATE_TIME = "DATE_TIME",
}
export const literalValueTypeElements : readonly LiteralValueType[] = Object.values<LiteralValueType>(LiteralValueType as unknown as { [k:string] : LiteralValueType });

export interface DecimalLiteralNode {
    readonly type : "LiteralValue",
    readonly literalValueType : LiteralValueType.DECIMAL,
    readonly literalValue : string,
    readonly precision : bigint,
    readonly scale : bigint,
}
export interface StringLiteralNode {
    readonly type : "LiteralValue",
    readonly literalValueType : LiteralValueType.STRING,
    readonly literalValue : string,
}
export interface DoubleLiteralNode {
    readonly type : "LiteralValue",
    readonly literalValueType : LiteralValueType.DOUBLE,
    readonly literalValue : number,
}
export interface BigIntSignedLiteralNode {
    readonly type : "LiteralValue",
    readonly literalValueType : LiteralValueType.BIGINT_SIGNED,
    readonly literalValue : bigint,
}
export interface BooleanLiteralNode {
    readonly type : "LiteralValue",
    readonly literalValueType : LiteralValueType.BOOLEAN,
    readonly literalValue : boolean,
}
/**
 * @todo Rename this to Uint8ArrayLiteralNode
 */
export interface BufferLiteralNode {
    readonly type : "LiteralValue",
    readonly literalValueType : LiteralValueType.BUFFER,
    readonly literalValue : Uint8Array,
}
export interface NullLiteralNode {
    readonly type : "LiteralValue",
    readonly literalValueType : LiteralValueType.NULL,
    readonly literalValue : null,
}
export interface DateTimeLiteralNode {
    readonly type : "LiteralValue",
    readonly literalValueType : LiteralValueType.DATE_TIME,
    readonly literalValue : Date,
}
export type LiteralValueNode =
    | DecimalLiteralNode
    | StringLiteralNode
    | DoubleLiteralNode
    | BigIntSignedLiteralNode
    | BooleanLiteralNode
    | BufferLiteralNode
    | NullLiteralNode
    | DateTimeLiteralNode
;

/**
 * In particular,
 * + `BLOB` data should be sent as a `Uint8Array`
 * + `JSON` data should be sent as a `string`
 * + `undefined` IS NOT ALLOWED
 * + `DECIMAL` data is sent as `string` for now because
 *   there is no native arbitrary-precision-floating-point or fixed-point type in JS
 *
 * We do not consider `DECIMAL` a built-in type because JS does not support it natively.
 *
 */
export type BuiltInValueExpr = bigint|number|string|boolean|Date|Uint8Array|null;
export type NonNullBuiltInValueExpr = Exclude<BuiltInValueExpr, null>;

/**
 * In particular,
 * + `BLOB` data should be sent as a `Buffer`
 * + `JSON` data should be sent as a `string`
 * + `undefined` IS NOT ALLOWED
 * + `DECIMAL` data is sent as `string` for now because
 *   there is no native arbitrary-precision-floating-point or fixed-point type in JS
 *
 * We do not consider `DECIMAL` a primitive because JS does not support it natively.
 *
 */
export type PrimitiveExpr = bigint|number|string|boolean|Date|Buffer|null;
export type NonNullPrimitiveExpr = Exclude<PrimitiveExpr, null>;

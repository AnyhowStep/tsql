import * as tm from "type-mapping";
import {isDataType} from "./is-data-type";
import {BuiltInValueExprUtil} from "../../../built-in-value-expr";

/**
 * If `mapper` is `IDataType`, it uses `mapper.isNullSafeEqual()`.
 *
 * Else, it uses a fallback algorithm that works fine for `BuiltInValueExpr`,
 * but may not be suitable for custom data types.
 */
export function isNullSafeEqual<TypeT> (
    mapper : tm.SafeMapper<TypeT>,
    a : TypeT,
    b : TypeT,
) : boolean {
    if (isDataType(mapper)) {
        return mapper.isNullSafeEqual(a, b);
    } else {
        if (BuiltInValueExprUtil.isBuiltInValueExpr(a)) {
            if (BuiltInValueExprUtil.isBuiltInValueExpr(b)) {
                return BuiltInValueExprUtil.isEqual(a, b);
            } else {
                return false;
            }
        } else {
            return tm.TypeUtil.strictEqual(a, b);
        }
    }
}

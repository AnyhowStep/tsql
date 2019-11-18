import * as tm from "type-mapping";
import {isDataType} from "./is-data-type";
import {PrimitiveExprUtil} from "../../../primitive-expr";

/**
 * If `mapper` is `IDataType`, it uses `mapper.isNullSafeEqual()`.
 *
 * Else, it uses a fallback algorithm that works fine for `PrimitiveExpr`,
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
        if (PrimitiveExprUtil.isPrimitiveExpr(a)) {
            if (PrimitiveExprUtil.isPrimitiveExpr(b)) {
                return PrimitiveExprUtil.isEqual(a, b);
            } else {
                return false;
            }
        } else {
            return tm.TypeUtil.strictEqual(a, b);
        }
    }
}

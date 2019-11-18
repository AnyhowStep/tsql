import * as tm from "type-mapping";
import {isDataType} from "../predicate";
import {PrimitiveExprUtil} from "../../../primitive-expr";
import {RawExprNoUsedRef} from "../../../raw-expr";

/**
 * If `mapper` is `IDataType`, it uses `mapper.toRawExpr()`.
 *
 * Else, it uses a fallback algorithm that works fine for `PrimitiveExpr`.
 * If the `value` is not a `PrimitiveExpr`, an error is thrown.
 */
export function toRawExpr<TypeT> (
    mapper : tm.SafeMapper<TypeT>,
    value : TypeT
) : RawExprNoUsedRef<TypeT> {
    if (isDataType(mapper)) {
        return mapper.toRawExpr(
            /**
             * Validate the incoming value again, just to be sure...
             */
            mapper("literal-value", value)
        );
    } else {
        if (PrimitiveExprUtil.isPrimitiveExpr(value)) {
            return value as RawExprNoUsedRef<TypeT>;
        } else {
            /**
             * @todo Custom `Error` type
             */
            throw new Error(`Don't know how to convert ${tm.TypeUtil.toTypeStr(value)} value with keys ${Object.keys(value).map(k => JSON.stringify(k)).join(", ")} to RawExpr`);
        }
    }
}

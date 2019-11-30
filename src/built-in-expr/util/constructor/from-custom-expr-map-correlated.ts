import * as tm from "type-mapping";
import {IAnonymousColumn} from "../../../column";
import {BuiltInExpr_MapCorrelated, AnyBuiltInExpr} from "../../built-in-expr";
import {ColumnMap} from "../../../column-map";
import {CustomExpr_MapCorrelated} from "../../../custom-expr";
import {isAnyNonValueExpr} from "../predicate";
import {UsedRefUtil} from "../../../used-ref";
import {usedRef} from "../query";
import {fromValueExpr} from "./from-value-expr";

/**
 * If `mapper` is `IDataType`, it uses `mapper.toBuiltInExpr_NonCorrelated()`.
 *
 * Else, it uses a fallback algorithm that works fine for `BuiltInValueExpr`.
 * If the `value` is not a `BuiltInValueExpr`, an error is thrown.
 */
export function fromCustomExpr_MapCorrelated<ColumnMapT extends ColumnMap, TypeT> (
    mapper : tm.SafeMapper<TypeT>|IAnonymousColumn<TypeT>,
    allowed : UsedRefUtil.FromColumnMap<ColumnMapT>,
    customExpr : CustomExpr_MapCorrelated<ColumnMapT, TypeT>
) : BuiltInExpr_MapCorrelated<ColumnMapT, TypeT> {
    if (isAnyNonValueExpr(customExpr)) {
        UsedRefUtil.assertAllowed(
            allowed,
            usedRef(customExpr as AnyBuiltInExpr)
        );
        return customExpr as BuiltInExpr_MapCorrelated<ColumnMapT, TypeT>;
    } else {
        return fromValueExpr(
            mapper,
            customExpr
        ) as BuiltInExpr_MapCorrelated<ColumnMapT, TypeT>;
    }
}

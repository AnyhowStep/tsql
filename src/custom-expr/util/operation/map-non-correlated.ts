import * as tm from "type-mapping";
import {IAnonymousColumn, ColumnUtil} from "../../../column";
import {CustomExpr_NonCorrelated} from "../../custom-expr";
import {BuiltInExprUtil} from "../../../built-in-expr";
import {UsedRefUtil} from "../../../used-ref";
import {usedRef} from "../query";

/**
 * If `value` is `AnyNonValueExpr`, we don't bother checking.
 * We can't really check, anyway.
 *
 * Else, we return `mapper(, value)`,
 * which will throw an error if `value` is invalid.
 */
export function mapNonCorrelated<TypeT> (
    mapper : tm.SafeMapper<TypeT>|IAnonymousColumn<TypeT>,
    customExpr : CustomExpr_NonCorrelated<TypeT>
) : CustomExpr_NonCorrelated<TypeT> {
    let valueName = "literal-value";

    if (ColumnUtil.isColumn(mapper)) {
        valueName = `${mapper.tableAlias}${mapper.columnAlias}`;
        mapper = mapper.mapper;
    }

    if (BuiltInExprUtil.isAnyNonValueExpr(customExpr)) {
        /**
         * Cannot map a `NonValueExpr`
         */
        UsedRefUtil.assertEmpty(
            usedRef(
                customExpr
            )
        );
        return customExpr;
    } else {
        return mapper(valueName, customExpr);
    }
}

import * as tm from "type-mapping";
import {IAnonymousColumn, ColumnUtil} from "../../../column";
import {isAnyNonValueExpr} from "../predicate";
import {CustomExpr_NonCorrelated} from "../../built-in-expr";

/**
 * If `value` is `AnyNonValueExpr`, we don't bother checking.
 * We can't really check, anyway.
 *
 * Else, we return `mapper(, value)`,
 * which will throw an error if `value` is invalid.
 */
export function mapCustomExpr_NonCorrelated<TypeT> (
    mapper : tm.SafeMapper<TypeT>|IAnonymousColumn<TypeT>,
    value : CustomExpr_NonCorrelated<TypeT>
) : CustomExpr_NonCorrelated<TypeT> {
    let valueName = "literal-value";

    if (ColumnUtil.isColumn(mapper)) {
        valueName = `${mapper.tableAlias}${mapper.columnAlias}`;
        mapper = mapper.mapper;
    }

    if (isAnyNonValueExpr(value)) {
        /**
         * Cannot map a `NonValueExpr`
         */
        return value;
    } else {
        return mapper(valueName, value);
    }
}

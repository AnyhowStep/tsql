import * as tm from "type-mapping";
import {IAnonymousColumn, ColumnUtil} from "../../../column";
import {isAnyNonPrimitiveRawExpr} from "../predicate";
import {RawExprNoUsedRef_Input} from "../../raw-expr";

/**
 * If `value` is `AnyNonPrimitiveRawExpr`, we don't bother checking.
 * We can't really check, anyway.
 *
 * Else, we return `mapper(, value)`,
 * which will throw an error if `value` is invalid.
 */
export function mapRawExprInput<TypeT> (
    mapper : tm.SafeMapper<TypeT>|IAnonymousColumn<TypeT>,
    value : RawExprNoUsedRef_Input<TypeT>
) : RawExprNoUsedRef_Input<TypeT> {
    let valueName = "literal-value";

    if (ColumnUtil.isColumn(mapper)) {
        valueName = `${mapper.tableAlias}${mapper.columnAlias}`;
        mapper = mapper.mapper;
    }

    if (isAnyNonPrimitiveRawExpr(value)) {
        /**
         * Cannot map a `NonPrimitiveRawExpr`
         */
        return value;
    } else {
        return mapper(valueName, value);
    }
}

import * as tm from "type-mapping";
import {isDataType} from "../predicate";
import {BuiltInValueExprUtil} from "../../../built-in-value-expr";
import {BuiltInExpr_NonCorrelated} from "../../../built-in-expr";
import {IAnonymousColumn, ColumnUtil} from "../../../column";

/**
 * If `mapper` is `IDataType`, it uses `mapper.toBuiltInExpr_NonCorrelated()`.
 *
 * Else, it uses a fallback algorithm that works fine for `BuiltInValueExpr`.
 * If the `value` is not a `BuiltInValueExpr`, an error is thrown.
 */
export function toBuiltInExpr_NonCorrelated<TypeT> (
    mapper : tm.SafeMapper<TypeT>|IAnonymousColumn<TypeT>,
    value : TypeT
) : BuiltInExpr_NonCorrelated<TypeT> {
    let valueName = "literal-value";

    if (ColumnUtil.isColumn(mapper)) {
        valueName = `${mapper.tableAlias}${mapper.columnAlias}`;
        mapper = mapper.mapper;
    }
    if (isDataType(mapper)) {
        return mapper.toBuiltInExpr_NonCorrelated(
            /**
             * Validate the incoming value again, just to be sure...
             */
            mapper(valueName, value)
        );
    } else {
        if (BuiltInValueExprUtil.isBuiltInValueExpr(value)) {
            return mapper(valueName, value) as BuiltInExpr_NonCorrelated<TypeT>;
        } else {
            /**
             * @todo Custom `Error` type
             */
            throw new Error(`Don't know how to convert ${tm.TypeUtil.toTypeStr(value)} value with keys ${Object.keys(value).map(k => JSON.stringify(k)).join(", ")} to RawExpr`);
        }
    }
}

import * as tm from "type-mapping";
import {BuiltInValueExprUtil} from "../../../built-in-value-expr";
import {BuiltInExpr_NonCorrelated_NonAggregate} from "../../../built-in-expr";
import {IAnonymousColumn, ColumnUtil} from "../../../column";
import {DataTypeUtil} from "../../../data-type";

/**
 * If `mapper` is `IDataType`, it uses `mapper.toBuiltInExpr_NonCorrelated()`.
 *
 * Else, it uses a fallback algorithm that works fine for `BuiltInValueExpr`.
 * If the `value` is not a `BuiltInValueExpr`, an error is thrown.
 */
export function fromValueExpr<TypeT> (
    mapper : tm.SafeMapper<TypeT>|IAnonymousColumn<TypeT>,
    value : TypeT
) : BuiltInExpr_NonCorrelated_NonAggregate<TypeT> {
    let valueName = "literal-value";

    if (ColumnUtil.isColumn(mapper)) {
        valueName = `${mapper.tableAlias}${mapper.columnAlias}`;
        mapper = mapper.mapper;
    }
    if (DataTypeUtil.isDataType(mapper)) {
        return mapper.toBuiltInExpr_NonCorrelated(
            /**
             * Validate the incoming value again, just to be sure...
             */
            mapper(valueName, value)
        );
    } else {
        if (BuiltInValueExprUtil.isBuiltInValueExpr(value)) {
            return mapper(valueName, value) as BuiltInExpr_NonCorrelated_NonAggregate<TypeT>;
        } else {
            /**
             * @todo Custom `Error` type
             */
            throw new Error(`Don't know how to convert ${tm.TypeUtil.toTypeStr(value)} value with keys ${Object.keys(value).map(k => JSON.stringify(k)).join(", ")} to RawExpr`);
        }
    }
}

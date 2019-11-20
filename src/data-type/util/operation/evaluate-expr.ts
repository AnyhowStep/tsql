import * as tm from "type-mapping";
import {IAnonymousColumn} from "../../../column";
import {RawExprNoUsedRef_Input} from "../../../raw-expr";
import {SelectConnection} from "../../../execution";
import {QueryUtil} from "../../../unified-query";

/**
 * Given a type `T`, we may have a `RawExprNoUsedRef_Input<T>`.
 *
 * This may be `T` itself, or `IExpr<T>` or `IColumn<T>` or
 * any other non-`T`.
 *
 * However, we **want** `T`.
 * This function helps us resolve non-`T` types to `T` itself.
 */
export async function evaluateExpr<T> (
    column : IAnonymousColumn<T>,
    connection : SelectConnection,
    rawValue : RawExprNoUsedRef_Input<T>
) : Promise<T> {
    const valueResult = tm.tryMapHandled(
        column.mapper,
        `${column.tableAlias}.${column.columnAlias}`,
        rawValue
    );
    if (valueResult.success) {
        /**
         * We have `T`. Perfect.
         */
        return valueResult.value;
    }

    //Probably an expression, evaluate it to figure out what its value is
    const rawEvaluatedValue = await QueryUtil
        .newInstance()
        .selectValue(() => rawValue as any)
        .fetchValue(connection);
    //We must have a value now
    const evaluatedValue = column.mapper(
        `${column.tableAlias}.${column.columnAlias}`,
        rawEvaluatedValue
    );
    return evaluatedValue;
}

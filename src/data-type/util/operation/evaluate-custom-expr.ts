import * as tm from "type-mapping";
import {IAnonymousColumn} from "../../../column";
import {CustomExpr_NonCorrelated} from "../../../custom-expr";
import {SelectConnection} from "../../../execution";
import {QueryUtil} from "../../../unified-query";
import {isAnyNonValueExpr} from "../../../built-in-expr/util";

/**
 * Given a type `T`, we may have a `CustomExpr_NonCorrelated<T>`.
 *
 * This may be `T` itself, or `IExpr<T>` or `IColumn<T>` or
 * any other non-`T`.
 *
 * However, we **want** `T`.
 * This function helps us resolve non-`T` types to `T` itself.
 */
export async function evaluateCustomExpr<T> (
    column : IAnonymousColumn<T>,
    connection : SelectConnection,
    customExpr : CustomExpr_NonCorrelated<T>
) : Promise<T> {
    if (isAnyNonValueExpr(customExpr)) {
        //We have a non-value expression, evaluate it to figure out what its value is
        const rawEvaluatedValue = await QueryUtil
            .newInstance()
            .selectValue(() => customExpr as any)
            .fetchValue(connection);
        //We must have a value now
        const evaluatedValue = column.mapper(
            `${column.tableAlias}.${column.columnAlias}`,
            rawEvaluatedValue
        );
        return evaluatedValue;
    }

    const valueResult = tm.mapHandled(
        column.mapper,
        `${column.tableAlias}.${column.columnAlias}`,
        customExpr
    );
    return valueResult;
}

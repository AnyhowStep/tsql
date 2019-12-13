import {BuiltInExprUtil} from "../../../built-in-expr";
import {DataTypeUtil} from "../../../data-type";
import {ITable} from "../../../table";

/**
 * @todo Better name
 *
 * Adds properties from `row` to `result`.
 *
 * If a property from `row` already exists on `result`,
 * we use `table` to check if the values on both objects are equal.
 *
 * If they are not equal, an `Error` is thrown.
 */
export function absorbRow (
    result : Record<string, unknown>,
    table : ITable,
    row : Record<string, unknown>
) {
    for (const columnAlias of Object.keys(row)) {
        /**
         * This is guaranteed to be a value expression.
         */
        const newValue = row[columnAlias];

        if (Object.prototype.hasOwnProperty.call(result, columnAlias)) {
            /**
             * This `curValue` could be a non-value expression.
             * We only want value expressions.
             */
            const curValue = result[columnAlias];

            if (BuiltInExprUtil.isAnyNonValueExpr(curValue)) {
                /**
                 * Add this new value to the `result`
                 * so we can use it to update rows of tables
                 * further down the inheritance hierarchy.
                 */
                result[columnAlias] = newValue;
                continue;
            }

            if (curValue === newValue) {
                /**
                 * They are equal, do nothing.
                 */
                continue;
            }
            /**
             * We need some custom equality checking logic
             */
            if (!DataTypeUtil.isNullSafeEqual(
                table.columns[columnAlias],
                /**
                 * This may throw
                 */
                table.columns[columnAlias].mapper(
                    `${table.alias}.${columnAlias}`,
                    curValue
                ),
                newValue
            )) {
                /**
                 * @todo Custom `Error` type
                 */
                throw new Error(`All columns with the same name in an inheritance hierarchy must have the same value; mismatch found for ${table.alias}.${columnAlias}`);
            }
        } else {
            /**
             * Add this new value to the `result`
             * so we can use it to update rows of tables
             * further down the inheritance hierarchy.
             */
            result[columnAlias] = newValue;
        }
    }
}

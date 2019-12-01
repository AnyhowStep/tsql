import * as tm from "type-mapping";
import {ITable} from "../../../table";
import {CustomInsertRow, BuiltInInsertRow} from "../../insert-row";
import {BuiltInValueExprUtil} from "../../../built-in-value-expr";
import {BuiltInExprUtil} from "../../../built-in-expr";
import {QueryBaseUtil} from "../../../query-base";
import {ExprUtil} from "../../../expr";
import {ExprSelectItemUtil} from "../../../expr-select-item";
import {MissingRequiredInsertColumnError, NullableRequiredInsertColumnError} from "../../../error";

export function cleanInsertColumn<TableT extends ITable> (
    table : TableT,
    row : CustomInsertRow<TableT>,
    columnAlias : keyof CustomInsertRow<TableT>,
    required : true
) : BuiltInInsertRow<TableT>[keyof BuiltInInsertRow<TableT>];
export function cleanInsertColumn<TableT extends ITable> (
    table : TableT,
    row : CustomInsertRow<TableT>,
    columnAlias : keyof CustomInsertRow<TableT>,
    required : false
) : BuiltInInsertRow<TableT>[keyof BuiltInInsertRow<TableT>]|undefined;
export function cleanInsertColumn<TableT extends ITable> (
    table : TableT,
    row : CustomInsertRow<TableT>,
    columnAlias : keyof CustomInsertRow<TableT>,
    required : boolean
) : BuiltInInsertRow<TableT>[keyof BuiltInInsertRow<TableT>]|undefined {
    const customExpr = (
        /**
         * This is just safer.
         *
         * But how regularly should we access properties of mapped types this way?
         * All the time?
         * If so, why?
         *
         * Sometimes?
         * If so, what's the criteria?
         *
         * @todo Figure this out
         */
        (
            Object.prototype.hasOwnProperty.call(row, columnAlias) &&
            Object.prototype.propertyIsEnumerable.call(row, columnAlias)
        ) ?
        row[columnAlias] :
        undefined
    );
    if (customExpr === undefined) {
        if (required) {
            throw new MissingRequiredInsertColumnError(
                `Expected value for ${table.alias}.${columnAlias}; received undefined`,
                table,
                columnAlias
            );
        } else {
            return undefined;
        }
    }

    if (BuiltInValueExprUtil.isBuiltInValueExpr(customExpr)) {
        return table.columns[columnAlias].mapper(
            `${table.alias}.${columnAlias}`,
            customExpr
        );
    } else if (BuiltInExprUtil.isAnySubqueryExpr(customExpr)) {
        /**
         * Can't really perform many checks here.
         * We can, however, check for `NULL`s.
         */
        if (
            QueryBaseUtil.isZeroOrOneRow(customExpr) &&
            !tm.canOutputNull(table.columns[columnAlias].mapper)
        ) {
            throw new NullableRequiredInsertColumnError(
                `Cannot INSERT possibly NULL subquery expression to ${table.alias}.${columnAlias}`,
                table,
                columnAlias
            );
        }
        return customExpr as any;
    } else {
        /**
         * Could be an `IExpr`, `IExprSelectItem`, or a custom data type
         */
        if (
            ExprUtil.isExpr(customExpr) ||
            ExprSelectItemUtil.isExprSelectItem(customExpr)
        ) {
            /**
             * @todo Should we validate these?
             * How would one even do that?
             */
            return customExpr as any;
        }

        /**
         * Maybe a custom data type?
         */
        return BuiltInExprUtil.fromValueExpr(
            table.columns[columnAlias],
            customExpr
        );
    }
}

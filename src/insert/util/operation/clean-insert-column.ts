import * as tm from "type-mapping";
import {ITable} from "../../../table";
import {InsertRow_Input, InsertRow_Output} from "../../insert-row";
import {BuiltInValueExprUtil} from "../../../built-in-value-expr";
import {RawExprUtil} from "../../../raw-expr";
import {QueryBaseUtil} from "../../../query-base";
import {ExprUtil} from "../../../expr";
import {ExprSelectItemUtil} from "../../../expr-select-item";
import {MissingRequiredInsertColumnError, NullableRequiredInsertColumnError} from "../../../error";
import {DataTypeUtil} from "../../../data-type";

export function cleanInsertColumn<TableT extends ITable> (
    table : TableT,
    row : InsertRow_Input<TableT>,
    columnAlias : keyof InsertRow_Input<TableT>,
    required : true
) : InsertRow_Output<TableT>[keyof InsertRow_Output<TableT>];
export function cleanInsertColumn<TableT extends ITable> (
    table : TableT,
    row : InsertRow_Input<TableT>,
    columnAlias : keyof InsertRow_Input<TableT>,
    required : false
) : InsertRow_Output<TableT>[keyof InsertRow_Output<TableT>]|undefined;
export function cleanInsertColumn<TableT extends ITable> (
    table : TableT,
    row : InsertRow_Input<TableT>,
    columnAlias : keyof InsertRow_Input<TableT>,
    required : boolean
) : InsertRow_Output<TableT>[keyof InsertRow_Output<TableT>]|undefined {
    const value = (
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
    if (value === undefined) {
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

    if (BuiltInValueExprUtil.isBuiltInValueExpr(value)) {
        return table.columns[columnAlias].mapper(
            `${table.alias}.${columnAlias}`,
            value
        );
    } else if (RawExprUtil.isAnySubqueryExpr(value)) {
        /**
         * Can't really perform many checks here.
         * We can, however, check for `NULL`s.
         */
        if (
            QueryBaseUtil.isZeroOrOneRow(value) &&
            !tm.canOutputNull(table.columns[columnAlias].mapper)
        ) {
            throw new NullableRequiredInsertColumnError(
                `Cannot INSERT possibly NULL subquery expression to ${table.alias}.${columnAlias}`,
                table,
                columnAlias
            );
        }
        return value as any;
    } else {
        /**
         * Could be an `IExpr`, `IExprSelectItem`, or a custom data type
         */
        if (
            ExprUtil.isExpr(value) ||
            ExprSelectItemUtil.isExprSelectItem(value)
        ) {
            /**
             * @todo Should we validate these?
             * How would one even do that?
             */
            return value as any;
        }

        /**
         * Maybe a custom data type?
         */
        return DataTypeUtil.toRawExpr(
            table.columns[columnAlias],
            value
        );
    }
}

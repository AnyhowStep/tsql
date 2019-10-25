import * as tm from "type-mapping";
import {ITable} from "../../../table";
import {InsertRow} from "../../insert-row";
import {PrimitiveExprUtil} from "../../../primitive-expr";
import {RawExprUtil} from "../../../raw-expr";
import {QueryBaseUtil} from "../../../query-base";
import {ExprUtil} from "../../../expr";
import {ExprSelectItemUtil} from "../../../expr-select-item";
import {MissingRequiredInsertColumnError, NullableRequiredInsertColumnError, InvalidInsertColumnError} from "../../../error";

export function cleanInsertColumn<TableT extends ITable> (
    table : TableT,
    row : InsertRow<TableT>,
    columnAlias : keyof InsertRow<TableT>,
    required : true
) : InsertRow<TableT>[keyof InsertRow<TableT>];
export function cleanInsertColumn<TableT extends ITable> (
    table : TableT,
    row : InsertRow<TableT>,
    columnAlias : keyof InsertRow<TableT>,
    required : false
) : InsertRow<TableT>[keyof InsertRow<TableT>]|undefined;
export function cleanInsertColumn<TableT extends ITable> (
    table : TableT,
    row : InsertRow<TableT>,
    columnAlias : keyof InsertRow<TableT>,
    required : boolean
) : InsertRow<TableT>[keyof InsertRow<TableT>]|undefined {
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

    if (PrimitiveExprUtil.isPrimitiveExpr(value)) {
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
         * Could be an `IExpr`, `IExprSelectItem`
         *
         * @todo Should we validate these?
         */
        if (
            !ExprUtil.isExpr(value) &&
            !ExprSelectItemUtil.isExprSelectItem(value)
        ) {
            throw new InvalidInsertColumnError(
                `Expected PrimitiveExpr|Expr|ExprSelectItem|AnySubquery for ${table.alias}.${columnAlias} `,
                table,
                columnAlias
            );
        }
        return value as any;
    }
}

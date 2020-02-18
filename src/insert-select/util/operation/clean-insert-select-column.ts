import * as tm from "type-mapping";
import {ITable} from "../../../table";
import {InsertSelectRow} from "../../insert-select-row";
import {BuiltInValueExprUtil} from "../../../built-in-value-expr";
import {BuiltInExprUtil} from "../../../built-in-expr";
import {QueryBaseUtil} from "../../../query-base";
import {ExprUtil} from "../../../expr";
import {ExprSelectItemUtil} from "../../../expr-select-item";
import {MissingRequiredInsertColumnError, PotentialNullInRequiredInsertColumnError} from "../../../error";
import {ColumnUtil, IColumn} from "../../../column";
import {ColumnRefUtil} from "../../../column-ref";
import {ColumnIdentifierRefUtil} from "../../../column-identifier-ref";

export function cleanInsertSelectColumn<
    QueryT extends QueryBaseUtil.AfterSelectClause,
    TableT extends ITable
> (
    allowedColumnRef : ColumnRefUtil.FromSelectClause<QueryT["selectClause"]>,
    table : TableT,
    row : InsertSelectRow<QueryT, TableT>,
    columnAlias : keyof InsertSelectRow<QueryT, TableT>,
    required : true
) : InsertSelectRow<QueryT, TableT>[keyof InsertSelectRow<QueryT, TableT>];
export function cleanInsertSelectColumn<
    QueryT extends QueryBaseUtil.AfterSelectClause,
    TableT extends ITable
> (
    allowedColumnRef : ColumnRefUtil.FromSelectClause<QueryT["selectClause"]>,
    table : TableT,
    row : InsertSelectRow<QueryT, TableT>,
    columnAlias : keyof InsertSelectRow<QueryT, TableT>,
    required : false
) : InsertSelectRow<QueryT, TableT>[keyof InsertSelectRow<QueryT, TableT>]|undefined;
export function cleanInsertSelectColumn<
    QueryT extends QueryBaseUtil.AfterSelectClause,
    TableT extends ITable
> (
    allowedColumnRef : ColumnRefUtil.FromSelectClause<QueryT["selectClause"]>,
    table : TableT,
    row : InsertSelectRow<QueryT, TableT>,
    columnAlias : keyof InsertSelectRow<QueryT, TableT>,
    required : boolean
) : InsertSelectRow<QueryT, TableT>[keyof InsertSelectRow<QueryT, TableT>]|undefined {
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
            throw new MissingRequiredInsertColumnError({
                message : `Expected value for ${table.alias}.${columnAlias}; received undefined`,
                table,
                columnAlias
            });
        } else {
            return undefined;
        }
    }

    if (ColumnUtil.isColumn(customExpr)) {
        if (!ColumnIdentifierRefUtil.hasColumnIdentifier(allowedColumnRef, customExpr)) {
            throw new Error(`Invalid SELECT alias ${(customExpr as IColumn).tableAlias}.${(customExpr as IColumn).columnAlias}`);
        }
        return customExpr as any;
    } else if (BuiltInValueExprUtil.isBuiltInValueExpr(customExpr)) {
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
            throw new PotentialNullInRequiredInsertColumnError({
                message : `Cannot INSERT possibly NULL subquery expression to ${table.alias}.${columnAlias}`,
                table,
                columnAlias
            });
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

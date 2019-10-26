import * as tm from "type-mapping";
import {ITable} from "../../../table";
import {InsertSelectRow} from "../../insert-select-row";
import {PrimitiveExprUtil} from "../../../primitive-expr";
import {RawExprUtil} from "../../../raw-expr";
import {QueryBaseUtil} from "../../../query-base";
import {ExprUtil} from "../../../expr";
import {ExprSelectItemUtil} from "../../../expr-select-item";
import {MissingRequiredInsertColumnError, NullableRequiredInsertColumnError, InvalidInsertColumnError} from "../../../error";
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

    if (ColumnUtil.isColumn(value)) {
        if (!ColumnIdentifierRefUtil.hasColumnIdentifier(allowedColumnRef, value)) {
            throw new Error(`Invalid SELECT alias ${(value as IColumn).tableAlias}.${(value as IColumn).columnAlias}`);
        }
        return value as any;
    } else if (PrimitiveExprUtil.isPrimitiveExpr(value)) {
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
                `Expected Column|PrimitiveExpr|Expr|ExprSelectItem|AnySubquery for ${table.alias}.${columnAlias} `,
                table,
                columnAlias
            );
        }
        return value as any;
    }
}

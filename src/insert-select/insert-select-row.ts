import {ITable, TableUtil} from "../table";
import {BuiltInExpr_NonCorrelated} from "../raw-expr";
import {QueryBaseUtil} from "../query-base";
import {ColumnUtil} from "../column";

/**
 * @todo Allow `RawExprNoUsedRef_Input`
 */
export type InsertSelectRow<
    QueryT extends QueryBaseUtil.AfterSelectClause,
    TableT extends ITable
> =
    & {
        readonly [columnAlias in TableUtil.RequiredColumnAlias<TableT>] : (
            | BuiltInExpr_NonCorrelated<
                ReturnType<TableT["columns"][columnAlias]["mapper"]>
            >
            | ColumnUtil.ExtractWithType<
                ColumnUtil.FromSelectClause<QueryT["selectClause"]>,
                ReturnType<TableT["columns"][columnAlias]["mapper"]>
            >
        )
    }
    & {
        readonly [columnAlias in TableUtil.OptionalColumnAlias<TableT>]? : (
            | BuiltInExpr_NonCorrelated<
                ReturnType<TableT["columns"][columnAlias]["mapper"]>
            >
            | ColumnUtil.ExtractWithType<
                ColumnUtil.FromSelectClause<QueryT["selectClause"]>,
                ReturnType<TableT["columns"][columnAlias]["mapper"]>
            >
        )
    }
;

import {ITable, TableUtil} from "../table";
import {RawExprNoUsedRef_Output} from "../raw-expr";
import {QueryBaseUtil} from "../query-base";
import {ColumnUtil} from "../column";

export type InsertSelectRow<
    QueryT extends QueryBaseUtil.AfterSelectClause,
    TableT extends ITable
> =
    & {
        readonly [columnAlias in TableUtil.RequiredColumnAlias<TableT>] : (
            | RawExprNoUsedRef_Output<
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
            | RawExprNoUsedRef_Output<
                ReturnType<TableT["columns"][columnAlias]["mapper"]>
            >
            | ColumnUtil.ExtractWithType<
                ColumnUtil.FromSelectClause<QueryT["selectClause"]>,
                ReturnType<TableT["columns"][columnAlias]["mapper"]>
            >
        )
    }
;

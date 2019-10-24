import {ITable, TableUtil} from "../table";
import {RawExprNoUsedRef} from "../raw-expr";

export type InsertRow<TableT extends ITable> =
    & {
        readonly [columnAlias in TableUtil.RequiredColumnAlias<TableT>] : (
            RawExprNoUsedRef<
                ReturnType<TableT["columns"][columnAlias]["mapper"]>
            >
        )
    }
    & {
        readonly [columnAlias in TableUtil.OptionalColumnAlias<TableT>]? : (
            RawExprNoUsedRef<
                ReturnType<TableT["columns"][columnAlias]["mapper"]>
            >
        )
    }
;
export type InsertRowLiteral<TableT extends ITable> =
    {
        readonly [columnAlias in TableUtil.RequiredColumnAlias<TableT>] : (
            ReturnType<TableT["columns"][columnAlias]["mapper"]>
        )
    } &
    {
        readonly [columnAlias in TableUtil.OptionalColumnAlias<TableT>]? : (
            ReturnType<TableT["columns"][columnAlias]["mapper"]>
        )
    }
;

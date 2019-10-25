import {ITable, TableUtil, TableWithAutoIncrement} from "../table";
import {RawExprNoUsedRef} from "../raw-expr";

export type InsertRowPrimitiveAutoIncrement<TableT extends TableWithAutoIncrement> =
    TableT["autoIncrement"] extends TableT["generatedColumns"][number] ?
    InsertRow<TableT> :
    & {
        readonly [columnAlias in TableUtil.RequiredColumnAlias<TableT>] : (
            RawExprNoUsedRef<
                ReturnType<TableT["columns"][columnAlias]["mapper"]>
            >
        )
    }
    & {
        readonly [columnAlias in Exclude<TableUtil.OptionalColumnAlias<TableT>, TableT["autoIncrement"]>]? : (
            RawExprNoUsedRef<
                ReturnType<TableT["columns"][columnAlias]["mapper"]>
            >
        )
    }
    & {
        readonly [autoIncrement in TableT["autoIncrement"]]? : (
            ReturnType<TableT["columns"][autoIncrement]["mapper"]>
        )
    }
;
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

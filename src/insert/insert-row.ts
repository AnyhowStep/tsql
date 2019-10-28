import {ITable, TableUtil, TableWithAutoIncrement} from "../table";
import {RawExprNoUsedRef} from "../raw-expr";
import {Key} from "../key";

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

export type InsertRowPrimitiveCandidateKeyImpl<
    TableT extends ITable,
    CandidateKeyT extends Key
> =
    CandidateKeyT extends Key ?
    (
        & {
            readonly [columnAlias in Exclude<TableUtil.RequiredColumnAlias<TableT>, CandidateKeyT[number]>] : (
                RawExprNoUsedRef<
                    ReturnType<TableT["columns"][columnAlias]["mapper"]>
                >
            )
        }
        & {
            readonly [columnAlias in Exclude<TableUtil.OptionalColumnAlias<TableT>, CandidateKeyT[number]>]? : (
                RawExprNoUsedRef<
                    ReturnType<TableT["columns"][columnAlias]["mapper"]>
                >
            )
        }
        & {
            readonly [candidateKeyColumnAlias in CandidateKeyT[number]] : (
                ReturnType<TableT["columns"][candidateKeyColumnAlias]["mapper"]>
            )
        }
    ) :
    never
;
export type InsertRowPrimitiveCandidateKey<TableT extends ITable> =
    InsertRowPrimitiveCandidateKeyImpl<
        TableT,
        TableT["candidateKeys"][number]
    >
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

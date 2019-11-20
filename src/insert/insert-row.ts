import {ITable, TableUtil} from "../table";
import {RawExprNoUsedRef} from "../raw-expr";
import {Key} from "../key";

export type InsertRowRequireCandidateKeyImpl<
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
        /**
         * This Candidate key is required.
         */
        & {
            readonly [candidateKeyColumnAlias in CandidateKeyT[number]] : (
                RawExprNoUsedRef<
                    ReturnType<TableT["columns"][candidateKeyColumnAlias]["mapper"]>
                >
            )
        }
    ) :
    never
;
export type InsertRowRequireCandidateKey<TableT extends ITable> =
    InsertRowRequireCandidateKeyImpl<
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

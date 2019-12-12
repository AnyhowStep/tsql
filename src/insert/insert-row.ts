import {ITable, TableUtil} from "../table";
import {BuiltInExpr_NonCorrelated, BuiltInExpr_NonCorrelatedOrUndefined} from "../built-in-expr";
import {CustomExpr_NonCorrelated, CustomExpr_NonCorrelatedOrUndefined} from "../custom-expr";
import {Key, KeyUtil} from "../key";
import {Identity} from "../type-util";

export type CustomInsertRowWithCandidateKey_NonUnion<
    TableT extends ITable,
    CandidateKeyT extends Key
> =
    Identity<
        & {
            readonly [columnAlias in Exclude<TableUtil.RequiredColumnAlias<TableT>, CandidateKeyT[number]>] : (
                CustomExpr_NonCorrelated<
                    ReturnType<TableT["columns"][columnAlias]["mapper"]>
                >
            )
        }
        & {
            readonly [columnAlias in Exclude<TableUtil.OptionalColumnAlias<TableT>, CandidateKeyT[number]>]? : (
                CustomExpr_NonCorrelatedOrUndefined<
                    ReturnType<TableT["columns"][columnAlias]["mapper"]>
                >
            )
        }
        /**
         * This Candidate key is required.
         */
        & {
            readonly [candidateKeyColumnAlias in CandidateKeyT[number]] : (
                CustomExpr_NonCorrelated<
                    ReturnType<TableT["columns"][candidateKeyColumnAlias]["mapper"]>
                >
            )
        }
    >
;
export type CustomInsertRowWithCandidateKeyImpl<
    TableT extends ITable,
    CandidateKeyT extends Key
> =
    CandidateKeyT extends Key ?
    (
        KeyUtil.IsSubKey<CandidateKeyT, TableUtil.InsertableColumnAlias<TableT>[]> extends true ?
        CustomInsertRowWithCandidateKey_NonUnion<TableT, CandidateKeyT> :
        never
    ) :
    never
;
export type CustomInsertRowWithCandidateKey<TableT extends ITable> =
    CustomInsertRowWithCandidateKeyImpl<
        TableT,
        TableT["candidateKeys"][number]
    >
;

/**
 * This allows custom data types
 */
export type CustomInsertRow<TableT extends ITable> =
    Identity<
        & {
            readonly [columnAlias in TableUtil.RequiredColumnAlias<TableT>] : (
                CustomExpr_NonCorrelated<
                    ReturnType<TableT["columns"][columnAlias]["mapper"]>
                >
            )
        }
        & {
            readonly [columnAlias in TableUtil.OptionalColumnAlias<TableT>]? : (
                CustomExpr_NonCorrelatedOrUndefined<
                    ReturnType<TableT["columns"][columnAlias]["mapper"]>
                >
            )
        }
    >
;
export type ValueInsertRow<TableT extends ITable> =
    Identity<
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
    >
;

/**
 * This **does not** allow custom data types
 */
export type BuiltInInsertRow<TableT extends ITable> =
    Identity<
        & {
            readonly [columnAlias in TableUtil.RequiredColumnAlias<TableT>] : (
                BuiltInExpr_NonCorrelated<
                    ReturnType<TableT["columns"][columnAlias]["mapper"]>
                >
            )
        }
        & {
            readonly [columnAlias in TableUtil.OptionalColumnAlias<TableT>]? : (
                BuiltInExpr_NonCorrelatedOrUndefined<
                    ReturnType<TableT["columns"][columnAlias]["mapper"]>
                >
            )
        }
    >
;

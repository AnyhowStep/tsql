import {ITablePerType, TablePerTypeWithInsertAndFetchCandidateKeys} from "../../table-per-type";
import {ColumnType, RequiredColumnAlias, OptionalColumnAlias, InsertableColumnAlias} from "../query";
import {Identity} from "../../../type-util";
import {CustomExpr_NonCorrelated} from "../../../custom-expr";
import {BuiltInExpr_NonCorrelated} from "../../../built-in-expr";
import {Key, KeyUtil} from "../../../key";

export type ValueInsertRow<TptT extends ITablePerType> =
    Identity<
        & {
            readonly [columnAlias in RequiredColumnAlias<TptT>] : (
                ColumnType<TptT, columnAlias>
            )
        }
        & {
            readonly [columnAlias in OptionalColumnAlias<TptT>]? : (
                ColumnType<TptT, columnAlias>
            )
        }
    >
;

export type CustomInsertRow<TptT extends ITablePerType> =
    Identity<
        & {
            readonly [columnAlias in RequiredColumnAlias<TptT>] : (
                CustomExpr_NonCorrelated<
                    ColumnType<TptT, columnAlias>
                >
            )
        }
        & {
            readonly [columnAlias in OptionalColumnAlias<TptT>]? : (
                CustomExpr_NonCorrelated<
                    ColumnType<TptT, columnAlias>
                >
            )
        }
    >
;

export type BuiltInInsertRow<TptT extends ITablePerType> =
    Identity<
        & {
            readonly [columnAlias in RequiredColumnAlias<TptT>] : (
                BuiltInExpr_NonCorrelated<
                    ColumnType<TptT, columnAlias>
                >
            )
        }
        & {
            readonly [columnAlias in OptionalColumnAlias<TptT>]? : (
                BuiltInExpr_NonCorrelated<
                    ColumnType<TptT, columnAlias>
                >
            )
        }
    >
;

export type CustomInsertRowWithCandidateKey_NonUnion<
    TptT extends ITablePerType,
    CandidateKeyT extends Key
> =
    Identity<
        & {
            readonly [columnAlias in Exclude<RequiredColumnAlias<TptT>, CandidateKeyT[number]>] : (
                CustomExpr_NonCorrelated<
                    ColumnType<TptT, columnAlias>
                >
            )
        }
        & {
            readonly [columnAlias in Exclude<OptionalColumnAlias<TptT>, CandidateKeyT[number]>]? : (
                CustomExpr_NonCorrelated<
                    ColumnType<TptT, columnAlias>
                >
            )
        }
        /**
         * This Candidate key is required.
         */
        & {
            readonly [candidateKeyColumnAlias in CandidateKeyT[number]] : (
                CustomExpr_NonCorrelated<
                    ColumnType<TptT, candidateKeyColumnAlias>
                >
            )
        }
    >
;
export type CustomInsertRowWithCandidateKeyImpl<
    TptT extends ITablePerType,
    CandidateKeyT extends Key
> =
    CandidateKeyT extends Key ?
    (
        KeyUtil.IsSubKey<CandidateKeyT, InsertableColumnAlias<TptT>[]> extends true ?
        CustomInsertRowWithCandidateKey_NonUnion<TptT, CandidateKeyT> :
        never
    ) :
    never
;
export type CustomInsertRowWithCandidateKey<
    TptT extends TablePerTypeWithInsertAndFetchCandidateKeys
> =
    TptT["childInsertAndFetchCandidateKeys"] extends readonly never[] ?
    never :
    TptT["parentInsertAndFetchCandidateKeys"] extends readonly never[] ?
    never :
    CustomInsertRowWithCandidateKeyImpl<
        TptT,
        KeyUtil.ConcatDistribute<
            TptT["childInsertAndFetchCandidateKeys"][number],
            TptT["parentInsertAndFetchCandidateKeys"][number]
        >
    >
;

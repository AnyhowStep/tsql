import {ITablePerType} from "../../table-per-type";
import {ColumnType, RequiredColumnAlias, OptionalColumnAlias, InsertableColumnAlias} from "../query";
import {Identity} from "../../../type-util";
import {CustomExpr_NonCorrelated, CustomExpr_NonCorrelatedOrUndefined} from "../../../custom-expr";
import {BuiltInExpr_NonCorrelated, BuiltInExpr_NonCorrelatedOrUndefined} from "../../../built-in-expr";
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
                CustomExpr_NonCorrelatedOrUndefined<
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
                BuiltInExpr_NonCorrelatedOrUndefined<
                    ColumnType<TptT, columnAlias>
                >
            )
        }
    >
;

export type CustomInsertRowWithPrimaryKey_NonUnion<
    TptT extends ITablePerType,
    PrimaryKeyT extends Key
> =
    Identity<
        & {
            readonly [columnAlias in Exclude<RequiredColumnAlias<TptT>, PrimaryKeyT[number]>] : (
                CustomExpr_NonCorrelated<
                    ColumnType<TptT, columnAlias>
                >
            )
        }
        & {
            readonly [columnAlias in Exclude<OptionalColumnAlias<TptT>, PrimaryKeyT[number]>]? : (
                CustomExpr_NonCorrelatedOrUndefined<
                    ColumnType<TptT, columnAlias>
                >
            )
        }
        /**
         * This primary key is required.
         */
        & {
            readonly [candidateKeyColumnAlias in PrimaryKeyT[number]] : (
                CustomExpr_NonCorrelated<
                    ColumnType<TptT, candidateKeyColumnAlias>
                >
            )
        }
    >
;
export type CustomInsertRowWithPrimaryKeyImpl<
    TptT extends ITablePerType,
    PrimaryKeyT extends Key
> =
    PrimaryKeyT extends Key ?
    (
        KeyUtil.IsSubKey<PrimaryKeyT, InsertableColumnAlias<TptT>[]> extends true ?
        CustomInsertRowWithPrimaryKey_NonUnion<TptT, PrimaryKeyT> :
        never
    ) :
    never
;
export type CustomInsertRowWithPrimaryKey<
    TptT extends ITablePerType
> =
    CustomInsertRowWithPrimaryKeyImpl<
        TptT,
        TptT["insertAndFetchPrimaryKey"]
    >
;

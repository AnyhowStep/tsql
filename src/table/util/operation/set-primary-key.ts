import * as tm from "type-mapping";
import {ITable} from "../../table";
import {Table} from "../../table-impl";
import {IAnonymousColumn, ColumnUtil, IColumn, ColumnArrayUtil} from "../../../column";
import {NonNullPrimitiveExpr} from "../../../primitive-expr";
import {AssertValidCandidateKey, assertValidCandidateKey} from "./add-candidate-key";
import {KeyArrayUtil, KeyUtil} from "../../../key";
import {pickOwnEnumerable} from "../../../type-util";

/**
 * The aliases of columns that can be part of a `PRIMARY KEY`
 *
 * -----
 *
 * + `PRIMARY KEY` columns cannot be nullable
 * + `PRIMARY KEY` columns must be a candidate key
 */
export type AllowedPrimaryKeyColumnAlias<TableT extends Pick<ITable, "columns">> = (
    {
        [columnAlias in Extract<keyof TableT["columns"], string>] : (
            TableT["columns"][columnAlias] extends IAnonymousColumn<NonNullPrimitiveExpr> ?
            columnAlias :
            /**
             * Cannot be nullable
             */
            never
        )
    }[Extract<keyof TableT["columns"], string>]
);
/**
 * @see {@link AllowedPrimaryKeyColumnAlias}
 */
export type AllowedPrimaryKeyColumnMap<TableT extends Pick<ITable, "columns">> = (
    {
        readonly [columnName in AllowedPrimaryKeyColumnAlias<TableT>] : (
            TableT["columns"][columnName]
        )
    }
);
export function allowedPrimaryKeyColumnMap<
    TableT extends Pick<ITable, "columns">
> (
    table : TableT
) : (
    AllowedPrimaryKeyColumnMap<TableT>
) {
    const result : AllowedPrimaryKeyColumnMap<TableT> = pickOwnEnumerable(
        table.columns,
        ColumnArrayUtil.fromColumnMap(table.columns)
            .filter(column => !tm.canOutputNull(column.mapper))
            .map(column => column.columnAlias)
    ) as AllowedPrimaryKeyColumnMap<TableT>;
    return result;
}
/**
 * @see {@link AllowedPrimaryKeyColumnAlias}
 */
export type PrimaryKeyDelegate<
    TableT extends Pick<ITable, "columns"|"candidateKeys">,
    KeyT extends readonly ColumnUtil.FromColumnMap<AllowedPrimaryKeyColumnMap<TableT>>[]
> = (
    (columnMap : AllowedPrimaryKeyColumnMap<TableT>) => (
        KeyT
    )
);
export type AssertValidPrimaryKey<
    TableT extends Pick<ITable, "columns"|"candidateKeys">,
    KeyT extends readonly ColumnUtil.FromColumnMap<AllowedPrimaryKeyColumnMap<TableT>>[]
> = (
    AssertValidCandidateKey<
        TableT,
        Extract<
            KeyT,
            readonly ColumnUtil.FromColumnMap<TableT["columns"]>[]
        >
    >
);
export function assertValidPrimaryKey (
    table : Pick<ITable, "candidateKeys"|"columns">,
    columns : readonly IColumn[]
) {
    //An extra run-time check, just to be safe...
    //For all the JS-land users
    for (const column of columns) {
        if (tm.canOutputNull(column.mapper)) {
            throw new Error(`${column.tableAlias}.${column.columnAlias} cannot be part of a PRIMARY KEY; it is nullable`);
        }
    }
    assertValidCandidateKey(table, columns);
}
/**
 * @see {@link AllowedPrimaryKeyColumnAlias}
 */
export type SetPrimaryKey<
    TableT extends ITable,
    KeyT extends readonly ColumnUtil.FromColumnMap<AllowedPrimaryKeyColumnMap<TableT>>[]
> = (
    Table<{
        lateral : TableT["lateral"],
        tableAlias : TableT["tableAlias"],
        columns : TableT["columns"],
        usedRef : TableT["usedRef"],

        autoIncrement : TableT["autoIncrement"],
        id : TableT["id"],
        primaryKey : (
            KeyUtil.FromColumnArray<KeyT>
        ),
        candidateKeys : KeyArrayUtil.Append<
            TableT["candidateKeys"],
            KeyUtil.FromColumnArray<KeyT>
        >,

        insertAllowed : TableT["insertAllowed"],
        deleteAllowed : TableT["deleteAllowed"],

        generatedColumns : TableT["generatedColumns"],
        nullableColumns : TableT["nullableColumns"],
        explicitDefaultValueColumns : TableT["explicitDefaultValueColumns"],
        mutableColumns : TableT["mutableColumns"],

        parents : TableT["parents"],
    }>
);
export function setPrimaryKey<
    TableT extends ITable,
    KeyT extends readonly ColumnUtil.FromColumnMap<AllowedPrimaryKeyColumnMap<TableT>>[]
> (
    table : TableT,
    delegate : (
        PrimaryKeyDelegate<
            TableT,
            (
                & KeyT
                & AssertValidPrimaryKey<
                    TableT,
                    KeyT
                >
            )
        >
    )
) : (
    SetPrimaryKey<TableT, KeyT>
) {
    const newPrimaryKey : KeyT = delegate(allowedPrimaryKeyColumnMap(table));

    assertValidPrimaryKey(table, newPrimaryKey);

    const primaryKey : KeyUtil.FromColumnArray<KeyT> = (
        KeyUtil.fromColumnArray(newPrimaryKey)
    );
    const candidateKeys : (
        KeyArrayUtil.Append<
            TableT["candidateKeys"],
            KeyUtil.FromColumnArray<KeyT>
        >
    ) = KeyArrayUtil.append(
        table.candidateKeys,
        primaryKey
    );
    const {
        lateral,
        tableAlias,
        columns,
        usedRef,

        autoIncrement,
        id,
        //primaryKey,
        //candidateKeys,

        insertAllowed,
        deleteAllowed,

        generatedColumns,
        nullableColumns,
        explicitDefaultValueColumns,
        mutableColumns,

        parents,
    } = table;

    const result : SetPrimaryKey<TableT, KeyT> = new Table(
        {
            lateral,
            tableAlias,
            columns,
            usedRef,

            autoIncrement,
            id,
            primaryKey,
            candidateKeys,

            insertAllowed,
            deleteAllowed,

            generatedColumns,
            nullableColumns,
            explicitDefaultValueColumns,
            mutableColumns,

            parents,
        },
        table.unaliasedAst
    );
    return result;
}

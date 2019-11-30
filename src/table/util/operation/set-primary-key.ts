import * as tm from "type-mapping";
import {ITable} from "../../table";
import {Table} from "../../table-impl";
import {ColumnUtil, IColumn, ColumnArrayUtil} from "../../../column";
import {AssertValidCandidateKey, assertValidCandidateKey} from "./add-candidate-key";
import {KeyArrayUtil, KeyUtil} from "../../../key";
import {pickOwnEnumerable} from "../../../type-util";

/**
 * @todo Allow custom data types for primary key.
 * The downside of this is that checking for `NULL` values will become harder.
 */
export type SetPrimaryKeyColumnAlias<TableT extends Pick<ITable, "columns">> = (
    {
        [columnAlias in Extract<keyof TableT["columns"], string>] : (
            null extends tm.OutputOf<TableT["columns"][columnAlias]["mapper"]> ?
            /**
             * Cannot be nullable
             */
            never :
            columnAlias
        )
    }[Extract<keyof TableT["columns"], string>]
);

export type SetPrimaryKeyColumnMap<TableT extends Pick<ITable, "columns">> = (
    {
        readonly [columnName in SetPrimaryKeyColumnAlias<TableT>] : (
            TableT["columns"][columnName]
        )
    }
);
export function setPrimaryKeyColumnMap<
    TableT extends Pick<ITable, "columns">
> (
    table : TableT
) : (
    SetPrimaryKeyColumnMap<TableT>
) {
    const result : SetPrimaryKeyColumnMap<TableT> = pickOwnEnumerable(
        table.columns,
        ColumnArrayUtil.fromColumnMap(table.columns)
            .filter(column => !tm.canOutputNull(column.mapper))
            .map(column => column.columnAlias)
    ) as SetPrimaryKeyColumnMap<TableT>;
    return result;
}

export type SetPrimaryKeyDelegate<
    TableT extends Pick<ITable, "columns"|"candidateKeys">,
    KeyT extends readonly ColumnUtil.FromColumnMap<SetPrimaryKeyColumnMap<TableT>>[]
> = (
    (columnMap : SetPrimaryKeyColumnMap<TableT>) => (
        KeyT
    )
);
export type AssertValidPrimaryKey<
    TableT extends Pick<ITable, "columns"|"candidateKeys">,
    KeyT extends readonly ColumnUtil.FromColumnMap<SetPrimaryKeyColumnMap<TableT>>[]
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

export type SetPrimaryKey<
    TableT extends ITable,
    KeyT extends readonly ColumnUtil.FromColumnMap<SetPrimaryKeyColumnMap<TableT>>[]
> = (
    Table<{
        isLateral : TableT["isLateral"],
        alias : TableT["alias"],
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

        insertEnabled : TableT["insertEnabled"],
        deleteEnabled : TableT["deleteEnabled"],

        generatedColumns : TableT["generatedColumns"],
        nullableColumns : TableT["nullableColumns"],
        explicitDefaultValueColumns : TableT["explicitDefaultValueColumns"],
        mutableColumns : TableT["mutableColumns"],
    }>
);
/**
 * Sets the `PRIMARY KEY` of the table.
 *
 * In MySQL, a `PRIMARY KEY` is just a candidate key
 * where all its columns are non-nullable.
 *
 * -----
 *
 * + `PRIMARY KEY` columns cannot be nullable
 * + `PRIMARY KEY` columns must be a candidate key
 */
export function setPrimaryKey<
    TableT extends ITable,
    KeyT extends readonly ColumnUtil.FromColumnMap<SetPrimaryKeyColumnMap<TableT>>[]
> (
    table : TableT,
    delegate : (
        SetPrimaryKeyDelegate<
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
    const newPrimaryKey : KeyT = delegate(setPrimaryKeyColumnMap(table));

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
        isLateral,
        alias,
        columns,
        usedRef,

        autoIncrement,
        id,
        //primaryKey,
        //candidateKeys,

        insertEnabled,
        deleteEnabled,

        generatedColumns,
        nullableColumns,
        explicitDefaultValueColumns,
        mutableColumns,
    } = table;

    const result : SetPrimaryKey<TableT, KeyT> = new Table(
        {
            isLateral,
            alias,
            columns,
            usedRef,

            autoIncrement,
            id,
            primaryKey,
            candidateKeys,

            insertEnabled,
            deleteEnabled,

            generatedColumns,
            nullableColumns,
            explicitDefaultValueColumns,
            mutableColumns,
        },
        table.unaliasedAst
    );
    return result;
}

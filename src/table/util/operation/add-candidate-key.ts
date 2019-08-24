import {ITable} from "../../table";
import {Table} from "../../table-impl";
import {CompileError} from "../../../compile-error";
import {ColumnUtil, IColumn} from "../../../column";
import {KeyUtil, KeyArrayUtil} from "../../../key";
import {assertHasColumnIdentifiers} from "../predicate";

/**
 * This delegate returns a candidate key
 */
export type AddCandidateKeyDelegate<
    TableT extends Pick<ITable, "columns">,
    KeyT extends readonly ColumnUtil.FromColumnMap<TableT["columns"]>[]
> = (
    (columnMap : TableT["columns"]) => KeyT
);
export type AssertNotEmptyKey<
    KeyT extends readonly IColumn[]
> = (
    KeyT[number] extends never ?
    CompileError<[
        "Key cannot be empty"
    ]> :
    unknown
);
export function assertNotEmptyKey (
    columns : readonly IColumn[]
) {
    if (columns.length == 0) {
        throw new Error(`Key cannot be empty`);
    }
}
export type AssertNotSubKey<
    TableT extends Pick<ITable, "candidateKeys"|"columns">,
    KeyT extends readonly ColumnUtil.FromColumnMap<TableT["columns"]>[]
> = (
    KeyArrayUtil.FindSuperKey<
        TableT["candidateKeys"],
        KeyUtil.FromColumnArray<KeyT>
    > extends never ?
    //`TableT` does not contain any super keys of `KeyT`
    //`KeyT` is not a sub key of `TableT
    unknown :
    CompileError<[
        KeyUtil.FromColumnArray<KeyT>,
        "is a sub key of",
        KeyArrayUtil.FindSuperKey<
            TableT["candidateKeys"],
            KeyUtil.FromColumnArray<KeyT>
        >
    ]>
);
export function assertNotSubKey (
    table : Pick<ITable, "candidateKeys"|"columns">,
    columns : readonly IColumn[]
) {
    const key = KeyUtil.fromColumnArray(columns);
    const superKeys = KeyArrayUtil.findSuperKeys(table.candidateKeys, key);
    if (superKeys.length > 0) {
        throw new Error(`${key.join("|")} is a sub key of ${superKeys[0].join("|")}`);
    }
}
export type AssertNotSuperKey<
    TableT extends Pick<ITable, "candidateKeys"|"columns">,
    KeyT extends readonly ColumnUtil.FromColumnMap<TableT["columns"]>[]
> = (
    KeyArrayUtil.FindSubKey<
        TableT["candidateKeys"],
        KeyUtil.FromColumnArray<KeyT>
    > extends never ?
    //`TableT` does not contain any sub keys of `KeyT`
    //`KeyT` is not a super key of `TableT`
    unknown :
    CompileError<[
        KeyUtil.FromColumnArray<KeyT>,
        "is a super key of",
        KeyArrayUtil.FindSubKey<
            TableT["candidateKeys"],
            KeyUtil.FromColumnArray<KeyT>
        >
    ]>
);
export function assertNotSuperKey (
    table : Pick<ITable, "candidateKeys"|"columns">,
    columns : readonly IColumn[]
) {
    const key = KeyUtil.fromColumnArray(columns);
    const subKeys = KeyArrayUtil.findSubKeys(table.candidateKeys, key);
    if (subKeys.length > 0) {
        throw new Error(`${key.join("|")} is a super key of ${subKeys[0].join("|")}`);
    }
}
/**
 * The new candidate key, `KeyT`, must not be a super key or sub key
 * of an existing candidate key.
 *
 * Otherwise, either the new or existing key is not a candidate key
 * **by definition**.
 *
 * The definition of a candidate key is a
 * **smallest** possible set of columns that
 * uniquely identifies a row in a table.
 *
 * There may be multiple such sets.
 */
export type AssertValidCandidateKey<
    TableT extends Pick<ITable, "candidateKeys"|"columns">,
    KeyT extends readonly ColumnUtil.FromColumnMap<TableT["columns"]>[]
> = (
    & AssertNotEmptyKey<
        KeyT
    >
    & AssertNotSubKey<
        TableT,
        KeyT
    >
    & AssertNotSuperKey<
        TableT,
        KeyT
    >
);
export function assertValidCandidateKey (
    table : Pick<ITable, "candidateKeys"|"columns">,
    columns : readonly IColumn[]
) {
    assertHasColumnIdentifiers(table, columns);

    assertNotEmptyKey(columns);
    assertNotSubKey(table, columns);
    assertNotSuperKey(table, columns);
}

/**
 * Adds a candidate key to the table.
 *
 * A candidate key is a minimal set of columns that uniquely identifies a row in a table.
 *
 * + A table may have zero-to-many candidate keys. (recommended to have at least one)
 * + A candidate key cannot be a subset of other candidate keys.
 * + A candidate key cannot be a superset of other candidate keys.
 * + A candidate key can intersect other candidate keys.
 * + A candidate key can be disjoint from other candidate keys.
 */
export type AddCandidateKey<
    TableT extends ITable,
    KeyT extends readonly ColumnUtil.FromColumnMap<TableT["columns"]>[]
> = (
    Table<{
        isLateral : TableT["isLateral"],
        alias : TableT["alias"],
        columns : TableT["columns"],
        usedRef : TableT["usedRef"],

        autoIncrement : TableT["autoIncrement"],
        id : TableT["id"],
        primaryKey : TableT["primaryKey"],
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
 * Adds a candidate key to the table.
 *
 * A candidate key is a minimal set of columns that uniquely identifies a row in a table.
 *
 * + A table may have zero-to-many candidate keys. (recommended to have at least one)
 * + A candidate key cannot be a subset of other candidate keys.
 * + A candidate key cannot be a superset of other candidate keys.
 * + A candidate key can intersect other candidate keys.
 * + A candidate key can be disjoint from other candidate keys.
 *
 * @param table
 * @param delegate
 */
export function addCandidateKey<
    TableT extends ITable,
    KeyT extends readonly ColumnUtil.FromColumnMap<TableT["columns"]>[]
> (
    table : TableT,
    delegate : (
        AddCandidateKeyDelegate<
            TableT,
            (
                & KeyT
                & AssertValidCandidateKey<
                    TableT,
                    KeyT
                >
            )
        >
    )
) : (
    AddCandidateKey<TableT, KeyT>
) {
    const newCandidateKey : KeyT = delegate(table.columns);

    assertValidCandidateKey(table, newCandidateKey);

    const candidateKeys : (
        KeyArrayUtil.Append<
            TableT["candidateKeys"],
            KeyUtil.FromColumnArray<KeyT>
        >
    ) = KeyArrayUtil.append(
        table.candidateKeys,
        KeyUtil.fromColumnArray(newCandidateKey)
    );

    const {
        isLateral,
        alias,
        columns,
        usedRef,

        autoIncrement,
        id,
        primaryKey,
        //candidateKeys,

        insertEnabled,
        deleteEnabled,

        generatedColumns,
        nullableColumns,
        explicitDefaultValueColumns,
        mutableColumns,
    } = table;


    const result : AddCandidateKey<TableT, KeyT> = new Table(
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

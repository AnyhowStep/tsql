import * as tm from "type-mapping";
import {ITable} from "../../table";
import {Table} from "../../table-impl";
import {IAnonymousColumn, ColumnUtil, IColumn, ColumnArrayUtil} from "../../../column";
import {NonNullPrimitiveExpr} from "../../../primitive-expr";
import {KeyArrayUtil, KeyUtil} from "../../../key";
import {assertValidPrimaryKey, AssertValidPrimaryKey, SetPrimaryKeyColumnMap} from "./set-primary-key";
import {pickOwnEnumerable} from "../../../type-util";
import {ColumnIdentifierMapUtil} from "../../../column-identifier-map";

export type SetIdColumnAlias<TableT extends Pick<ITable, "columns"|"candidateKeys">> = (
    {
        [columnAlias in Extract<keyof TableT["columns"], string>] : (
            TableT["columns"][columnAlias] extends IAnonymousColumn<NonNullPrimitiveExpr> ?
            (
                columnAlias extends TableT["candidateKeys"][number][number] ?
                /**
                 * Columns already a part of a candidate key cannot be `id-column`
                 */
                never :
                columnAlias
            ) :
            /**
             * Cannot be nullable
             */
            never
        )
    }[Extract<keyof TableT["columns"], string>]
);

export type SetIdColumnMap<TableT extends Pick<ITable, "columns"|"candidateKeys">> = (
    {
        readonly [columnAlias in SetIdColumnAlias<TableT>] : (
            TableT["columns"][columnAlias]
        )
    }
);
export function setIdColumnMap<
    TableT extends Pick<ITable, "columns"|"candidateKeys">
> (
    table : TableT
) : (
    SetIdColumnMap<TableT>
) {
    const result : SetIdColumnMap<TableT> = pickOwnEnumerable(
        table.columns,
        ColumnArrayUtil.fromColumnMap(table.columns)
            .filter(column => {
                return (
                    !tm.canOutputNull(column.mapper) &&
                    !KeyArrayUtil.hasSuperKey(
                        table.candidateKeys,
                        [column.columnAlias]
                    )
                );
            })
            .map(column => column.columnAlias)
    ) as SetIdColumnMap<TableT>;
    return result;
}

export type SetIdDelegate<
    TableT extends Pick<ITable, "columns"|"candidateKeys">,
    IdT extends ColumnUtil.FromColumnMap<SetIdColumnMap<TableT>>
> = (
    (columnMap : SetIdColumnMap<TableT>) => (
        IdT
    )
);
export type AssertValidId<
    TableT extends Pick<ITable, "columns"|"candidateKeys">,
    IdT extends ColumnUtil.FromColumnMap<SetIdColumnMap<TableT>>
> = (
    AssertValidPrimaryKey<
        TableT,
        Extract<
            IdT[],
            readonly ColumnUtil.FromColumnMap<SetPrimaryKeyColumnMap<TableT>>[]
        >
    >
);
export function assertValidId (
    table : Pick<ITable, "candidateKeys"|"columns">,
    id : IColumn
) {
    const columnMap = setIdColumnMap(table);
    ColumnIdentifierMapUtil.assertHasColumnIdentifier(columnMap, id);

    assertValidPrimaryKey(table, [id]);
}

export type SetId<
    TableT extends ITable,
    IdT extends ColumnUtil.FromColumnMap<SetIdColumnMap<TableT>>
> = (
    Table<{
        isLateral : TableT["isLateral"],
        alias : TableT["alias"],
        columns : TableT["columns"],
        usedRef : TableT["usedRef"],

        autoIncrement : TableT["autoIncrement"],
        /**
         * This is now our `id-column`
         */
        id : IdT["columnAlias"];
        /**
         * By default, we make the `id-column`
         * the primary key.
         *
         * Usually, your `id-column` is also the primary key.
         * There is almost no reason for you to set anything else as the primary key.
         *
         * You may overwrite it by calling,
         * `.setPrimaryKey()`
         */
        primaryKey : KeyUtil.FromColumn<IdT>;
        /**
         * A set containing the `id-column`
         * is a candidate key.
         */
        candidateKeys : KeyArrayUtil.Append<
            TableT["candidateKeys"],
            KeyUtil.FromColumn<IdT>
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
 * Sets a column as the single-column identifier for this table.
 *
 * -----
 *
 * + `id-column`s cannot be nullable
 * + `id-column`s must be a candidate key
 * + `id-column`s must be a `PRIMARY KEY`
 *
 */
export function setId<
    TableT extends ITable,
    IdT extends ColumnUtil.FromColumnMap<SetIdColumnMap<TableT>>
> (
    table : TableT,
    delegate : (
        SetIdDelegate<
            TableT,
            (
                & IdT
                & AssertValidId<
                    TableT,
                    IdT
                >
            )
        >
    )
) : (
    SetId<TableT, IdT>
) {
    const newId : IdT = delegate(setIdColumnMap(table));

    assertValidId(table, newId);

    const primaryKey : KeyUtil.FromColumn<IdT> = (
        KeyUtil.fromColumn(newId)
    );
    const candidateKeys : (
        KeyArrayUtil.Append<
            TableT["candidateKeys"],
            KeyUtil.FromColumn<IdT>
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
        //id,
        //primaryKey,
        //candidateKeys,

        insertEnabled,
        deleteEnabled,

        generatedColumns,
        nullableColumns,
        explicitDefaultValueColumns,
        mutableColumns,
    } = table;

    const result : SetId<TableT, IdT> = new Table(
        {
            isLateral,
            alias,
            columns,
            usedRef,

            autoIncrement,
            id : newId.columnAlias,
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

import * as tm from "type-mapping";
import {ITable} from "../../table";
import {Table} from "../../table-impl";
import {IAnonymousColumn, ColumnUtil, IColumn, ColumnArrayUtil} from "../../../column";
import {NonNullPrimitiveExpr} from "../../../primitive-expr";
import {KeyArrayUtil, KeyUtil} from "../../../key";
import {assertValidPrimaryKey, AssertValidPrimaryKey, AllowedPrimaryKeyColumnMap} from "./set-primary-key";
import { pickOwnEnumerable } from "../../../type-util";
import { ColumnIdentifierMapUtil } from "../../../column-identifier-map";

/**
 * The aliases of columns that can be an `id-column`
 *
 * -----
 *
 * + `id-column`s cannot be nullable
 * + `id-column`s must be a candidate key
 * + `id-column`s must be a `PRIMARY KEY`
 *
 */
export type AllowedIdColumnAlias<TableT extends Pick<ITable, "columns"|"candidateKeys">> = (
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
/**
 * @see {@link AllowedIdColumnAlias}
 */
export type AllowedIdColumnMap<TableT extends Pick<ITable, "columns"|"candidateKeys">> = (
    {
        readonly [columnAlias in AllowedIdColumnAlias<TableT>] : (
            TableT["columns"][columnAlias]
        )
    }
);
export function allowedIdColumnMap<
    TableT extends Pick<ITable, "columns"|"candidateKeys">
> (
    table : TableT
) : (
    AllowedIdColumnMap<TableT>
) {
    const result : AllowedIdColumnMap<TableT> = pickOwnEnumerable(
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
    ) as AllowedIdColumnMap<TableT>;
    return result;
}
/**
 * @see {@link AllowedIdColumnAlias}
 */
export type IdDelegate<
    TableT extends Pick<ITable, "columns"|"candidateKeys">,
    IdT extends ColumnUtil.FromColumnMap<AllowedIdColumnMap<TableT>>
> = (
    (columnMap : AllowedIdColumnMap<TableT>) => (
        IdT
    )
);
export type AssertValidId<
    TableT extends Pick<ITable, "columns"|"candidateKeys">,
    IdT extends ColumnUtil.FromColumnMap<AllowedIdColumnMap<TableT>>
> = (
    AssertValidPrimaryKey<
        TableT,
        Extract<
            IdT[],
            readonly ColumnUtil.FromColumnMap<AllowedPrimaryKeyColumnMap<TableT>>[]
        >
    >
);
export function assertValidId (
    table : Pick<ITable, "candidateKeys"|"columns">,
    id : IColumn
) {
    const allowedColumns = allowedIdColumnMap(table);
    ColumnIdentifierMapUtil.assertHasColumnIdentifier(allowedColumns, id);

    assertValidPrimaryKey(table, [id]);
}
/**
 * @see {@link AllowedIdColumnAlias}
 */
export type SetId<
    TableT extends ITable,
    IdT extends ColumnUtil.FromColumnMap<AllowedIdColumnMap<TableT>>
> = (
    Table<{
        lateral : TableT["lateral"],
        tableAlias : TableT["tableAlias"],
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

        parents : TableT["parents"],
    }>
);
/**
 * @see {@link AllowedIdColumnAlias}
 */
export function setId<
    TableT extends ITable,
    IdT extends ColumnUtil.FromColumnMap<AllowedIdColumnMap<TableT>>
> (
    table : TableT,
    delegate : (
        IdDelegate<
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
    const newId : IdT = delegate(allowedIdColumnMap(table));

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
        lateral,
        tableAlias,
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

        parents,
    } = table;

    const result : SetId<TableT, IdT> = new Table(
        {
            lateral,
            tableAlias,
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

            parents,
        },
        table.unaliasedAst
    );
    return result;
}

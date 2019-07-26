import * as tm from "type-mapping";
import {ITable} from "../../table";
import {Table} from "../../table-impl";
import {IAnonymousColumn, ColumnArrayUtil, ColumnUtil, IColumn} from "../../../column";
import {KeyArrayUtil, KeyUtil} from "../../../key";
import {pickOwnEnumerable} from "../../../type-util";
import {AssertValidPrimaryKey, AllowedPrimaryKeyColumnMap, assertValidPrimaryKey} from "./set-primary-key";

/**
 * The aliases of columns that can be `AUTO_INCREMENT`
 *
 * -----
 *
 * + `AUTO_INCREMENT` columns cannot be nullable
 * + `AUTO_INCREMENT` columns must be a candidate key
 * + `AUTO_INCREMENT` columns must be a `PRIMARY KEY`
 * + The `number|string|bigint` requirement is only a compile-time constraint
 *
 * @todo Consider having run-time checks to see if it allows 1,2,3,4,5,... ?
 */
export type AllowedAutoIncrementColumnAlias<TableT extends Pick<ITable, "columns"|"candidateKeys">> = (
    {
        [columnAlias in Extract<keyof TableT["columns"], string>] : (
            TableT["columns"][columnAlias] extends IAnonymousColumn<number|string|bigint> ?
            (
                columnAlias extends TableT["candidateKeys"][number][number] ?
                /**
                 * Columns already a part of a candidate key cannot be `AUTO_INCREMENT`
                 */
                never :
                columnAlias
            ) :
            /**
             * Only `number|string|bigint` allowed
             */
            never
        )
    }[Extract<keyof TableT["columns"], string>]
);
/**
 * @see {@link AllowedAutoIncrementColumnAlias}
 */
export type AllowedAutoIncrementColumnMap<TableT extends Pick<ITable, "columns"|"candidateKeys">> = (
    {
        readonly [columnName in AllowedAutoIncrementColumnAlias<TableT>] : (
            TableT["columns"][columnName]
        )
    }
);
export function allowedAutoIncrementColumnMap<
    TableT extends Pick<ITable, "columns"|"candidateKeys">
> (
    table : TableT
) : (
    AllowedAutoIncrementColumnMap<TableT>
) {
    const result : AllowedAutoIncrementColumnMap<TableT> = pickOwnEnumerable(
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
    ) as AllowedAutoIncrementColumnMap<TableT>;
    return result;
}
/**
 * @see {@link AllowedAutoIncrementColumnAlias}
 */
export type AutoIncrementDelegate<
    TableT extends Pick<ITable, "columns"|"candidateKeys">,
    AutoIncrementT extends ColumnUtil.FromColumnMap<AllowedAutoIncrementColumnMap<TableT>>
> = (
    (columnMap : AllowedAutoIncrementColumnMap<TableT>) => (
        AutoIncrementT
    )
);
export type AssertValidAutoIncrement<
    TableT extends Pick<ITable, "columns"|"candidateKeys">,
    AutoIncrementT extends ColumnUtil.FromColumnMap<AllowedAutoIncrementColumnMap<TableT>>
> = (
    AssertValidPrimaryKey<
        TableT,
        Extract<
        AutoIncrementT[],
            readonly ColumnUtil.FromColumnMap<AllowedPrimaryKeyColumnMap<TableT>>[]
        >
    >
);
export function assertValidAutoIncrement (
    table : Pick<ITable, "candidateKeys"|"columns">,
    autoIncrement : IColumn
) {
    assertValidPrimaryKey(table, [autoIncrement]);
}
/**
 * @see {@link AllowedAutoIncrementColumnAlias}
 */
export type SetAutoIncrement<
    TableT extends ITable,
    AutoIncrementT extends ColumnUtil.FromColumnMap<AllowedAutoIncrementColumnMap<TableT>>
> = (
    Table<{
        lateral : TableT["lateral"],
        tableAlias : TableT["tableAlias"],
        columns : TableT["columns"],
        usedRef : TableT["usedRef"],

        /**
         * This is now our `AUTO_INCREMENT` column.
         */
        autoIncrement : AutoIncrementT["columnAlias"];
        /**
         * By default, we make the `AUTO_INCREMENT` column
         * the one-column-identifier.
         *
         * You may overwrite it by calling,
         * `.setId()`
         */
        id : AutoIncrementT["columnAlias"];
        /**
         * By default, we make the `AUTO_INCREMENT` column
         * the primary key.
         *
         * Usually, your `AUTO_INCREMENT` column is also the primary key.
         * There is almost no reason for you to set anything else as the primary key.
         *
         * You may overwrite it by calling,
         * `.setPrimaryKey()`
         */
        primaryKey : KeyUtil.FromColumn<AutoIncrementT>;
        /**
         * A set containing the `AUTO_INCREMENT` column
         * is a candidate key.
         */
        candidateKeys : KeyArrayUtil.Append<
            TableT["candidateKeys"],
            KeyUtil.FromColumn<AutoIncrementT>
        >;

        insertAllowed : TableT["insertAllowed"];
        deleteAllowed : TableT["deleteAllowed"];

        /**
         * By default, we make the `AUTO_INCREMENT` column
         * generated.
         *
         * Technically, an `AUTO_INCREMENT` column is
         * not a generated column.
         *
         * However, in most cases, it behaves like a generated column.
         *
         * + You do not set the `AUTO_INCREMENT` value on `INSERT`
         * + You do not set the `AUTO_INCREMENT` value on `UPDATE`
         *
         * You may make it non-generated by calling,
         * `.removeGenerated()`
         */
        generatedColumns : KeyUtil.Append<
            TableT["generatedColumns"],
            AutoIncrementT["columnAlias"]
        >;
        nullableColumns : TableT["nullableColumns"];
        /**
         * `AUTO_INCREMENT` columns have explicit default values.
         */
        explicitDefaultValueColumns : KeyUtil.Append<
            TableT["explicitDefaultValueColumns"],
            AutoIncrementT["columnAlias"]
        >;
        /**
         * By default, we make the `AUTO_INCREMENT` column
         * non-mutable.
         *
         * It's just safer to deny updates to it by default.
         *
         * You may make it mutable again by calling,
         *
         * 1. `.removeGenerated()` to make the column
         *    non-generated; generated columns cannot be mutable.
         * 1. `.addMutable()` to make the column mutable.
         */
        mutableColumns : KeyUtil.Remove<
            TableT["mutableColumns"],
            AutoIncrementT["columnAlias"]
        >;

        parents : TableT["parents"];
    }>
);
/**
 * @see {@link AllowedAutoIncrementColumnAlias}
 */
export function setAutoIncrement<
    TableT extends ITable,
    AutoIncrementT extends ColumnUtil.FromColumnMap<AllowedAutoIncrementColumnMap<TableT>>
> (
    table : TableT,
    delegate : (
        AutoIncrementDelegate<
            TableT,
            (
                & AutoIncrementT
                & AssertValidAutoIncrement<
                    TableT,
                    AutoIncrementT
                >
            )
        >
    )
) : (
    SetAutoIncrement<TableT, AutoIncrementT>
) {
    const newAutoIncrement : AutoIncrementT = delegate(allowedAutoIncrementColumnMap(table));

    assertValidAutoIncrement(table, newAutoIncrement);

    const primaryKey : KeyUtil.FromColumn<AutoIncrementT> = (
        KeyUtil.fromColumn(newAutoIncrement)
    );
    const candidateKeys : (
        KeyArrayUtil.Append<
            TableT["candidateKeys"],
            KeyUtil.FromColumn<AutoIncrementT>
        >
    ) = KeyArrayUtil.append(
        table.candidateKeys,
        primaryKey
    );

    const generatedColumns : (
        KeyUtil.Append<
            TableT["generatedColumns"],
            AutoIncrementT["columnAlias"]
        >
    ) = KeyUtil.append(
        table.generatedColumns,
        newAutoIncrement.columnAlias
    );
    const explicitDefaultValueColumns : (
        KeyUtil.Append<
            TableT["explicitDefaultValueColumns"],
            AutoIncrementT["columnAlias"]
        >
    ) = KeyUtil.append(
        table.explicitDefaultValueColumns,
        newAutoIncrement.columnAlias
    );
    const mutableColumns : (
        KeyUtil.Remove<
            TableT["mutableColumns"],
            AutoIncrementT["columnAlias"]
        >
    ) = KeyUtil.remove(
        table.mutableColumns,
        newAutoIncrement.columnAlias
    );

    const {
        lateral,
        tableAlias,
        columns,
        usedRef,

        //autoIncrement,
        //id,
        //primaryKey,
        //candidateKeys,

        insertAllowed,
        deleteAllowed,

        //generatedColumns,
        nullableColumns,
        //explicitDefaultValueColumns,
        //mutableColumns,

        parents,
    } = table;

    const result : SetAutoIncrement<TableT, AutoIncrementT> = new Table(
        {
            lateral,
            tableAlias,
            columns,
            usedRef,

            autoIncrement : newAutoIncrement.columnAlias,
            id : newAutoIncrement.columnAlias,
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

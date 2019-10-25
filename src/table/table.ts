import {Key} from "../key";
import {AliasedTableData, IAliasedTable} from "../aliased-table";
import {Ast} from "../ast";

/**
 * Does not have `parents` property.
 * https://www.postgresql.org/docs/9.1/ddl-inherit.html
 *
 * If a DBMS supports table inheritance, they should implement it
 * on their DBMS-specific repositories.
 */
export interface TableData extends AliasedTableData {
    readonly autoIncrement : undefined|string;
    readonly id : undefined|string;
    readonly primaryKey : undefined|Key;
    /**
     * @todo Debate making this `undefined|(readonly Key[])`
     *
     * Right now `eqPrimaryKey()` and `eqCandidateKey()` are slightly different.
     * `eqPrimaryKey()` requires `primaryKey : Key`.
     */
    readonly candidateKeys : readonly Key[];

    readonly insertEnabled : boolean;
    readonly deleteEnabled : boolean;

    readonly generatedColumns : readonly string[];
    readonly nullableColumns : readonly string[];
    readonly explicitDefaultValueColumns : readonly string[];
    readonly mutableColumns : readonly string[];
}

export interface ITable<DataT extends TableData=TableData> extends IAliasedTable<DataT> {
    readonly isLateral : DataT["isLateral"];
    readonly alias : DataT["alias"];
    readonly columns : DataT["columns"];
    readonly usedRef : DataT["usedRef"];

    readonly unaliasedAst : Ast;

    /**
     * The name of the auto-increment column.
     *
     * The maximum value `BIGINT UNSIGNED` can have is
     * `18446744073709551615`
     * which is `2^(32*8)-1` because `BIGINT UNSIGNED` uses 8 bytes.
     *
     * `BIGINT UNSIGNED` can have up to 20 digits...
     *
     * This cannot be represented correctly with JS' `number` type,
     * which should be an 8-byte floating point.
     *
     * The maximum safe value is `Number.MAX_SAFE_INTEGER`
     * which is `9,007,199,254,740,991`
     */
    readonly autoIncrement : DataT["autoIncrement"];
    /**
     * The name of the column that uniquely identifies a row
     * on the table.
     *
     * Note:
     *
     * + It is recommended you name your `id` columns in the format `tableNameId`.
     *
     *   A `user` table would have its `id` column named `userId`
     *   A `planet` table would have its `id` column named `planetId`
     *
     * + A table can have an `id` column that is not an `AUTO_INCREMENT` column
     * + A table can have a PK that is an FK to an auto-increment column in another table
     */
    readonly id : DataT["id"];

    /**
     * The column names that make up the primary key of the table.
     *
     * In MySQL, a primary key is just a candidate key
     * with the additional restriction that
     * all its columns cannot be nullable!
     *
     * Apart from that, the only thing "special"
     * about a primary key is that we say,
     *
     * > This is **the** candidate key I want to talk about by default
     *
     * -----
     *
     * It is recommended that every table have a primary key
    */
    readonly primaryKey : DataT["primaryKey"];

    /**
     * The candidate keys of the table.
     *
     * This includes the primary key, too.
     *
     * In MySQL, a candidate key is either a primary key or unique key.
     */
    readonly candidateKeys : DataT["candidateKeys"];

    /**
     * Determines if rows of this table can be inserted through this library.
     *
     * Defaults to `true`
     */
    readonly insertEnabled : DataT["insertEnabled"];
    /**
     * Determines if rows of this table can be deleted through this library.
     *
     * Defaults to `true`
     */
    readonly deleteEnabled : DataT["deleteEnabled"];

    /**
     * The name of `GENERATED` columns.
     *
     * A generated column has a default value *implicitly*.
     *
     * https://dev.mysql.com/doc/refman/5.7/en/create-table-generated-columns.html
     *
     * -----
     *
     * If a column is generated, you must specify as such manually.
     *
     * + Setting generated column values will not be allowed with `INSERT` statements.
     * + Updating generated column values will also not be allowed with `UPDATE` statements.
    */
    readonly generatedColumns : DataT["generatedColumns"];
    /**
     * The name of nullable columns.
     *
     * If a column is nullable, it has a server default value of `NULL`.
     *
     * A nullable column has a default value *implicitly*.
     *
     * -----
     *
     * ```ts
     *  const myTable = table("myTable")
     *      .addColumns({
     *          myColumn : tm.mysql.bigIntUnsigned().orNull(),
     *      });
     * ```
     *
     * `myTable.nullableColumns` is now `["myColumn"]` because
     * `"myColumn"` is nullable.
     *
     */
    readonly nullableColumns : DataT["nullableColumns"];
    /**
     * The name of columns with explicit default values.
     *
     * If a column is NOT nullable, but has a server default value,
     * like `CURRENT_TIMESTAMP` or some other value,
     * you will have to specify as such manually.
     *
     * + Columns with server default values are optional with `INSERT` statements.
     * + Generated columns have implicit default values.
     * + Nullable columns have implicit default values.
     */
    readonly explicitDefaultValueColumns : DataT["explicitDefaultValueColumns"];
    /**
     * The name of columns that can be updated through this library.
     *
     * By default, all columns are immutable.
     *
     * + Calling `addMutable()` will add the specified columns to the set of mutable columns.
     * + Calling `removeMutable()` will remove the specified columns from the set of mutable columns.
     * + Calling `addAllMutable()` will make as many columns as possible mutable.
     * + Calling `removeAllMutable()` will make all columns immutable.
     * + Generated columns cannot be mutable.
     */
    readonly mutableColumns : DataT["mutableColumns"];

    /**
     * @todo Refactor and move to a different directory
     *
     * Should not tightly couple feature to table implementation
     *
     * -----
     *
     * Used to implement table-per-type inheritance.
     *
     * Note:
     *
     * This feature is still in beta.
     * It works but is not perfect, and may not suit your needs 100%
     *
     * -----
     *
     * A parent table must be instantiated before the child table.
     *
     * The parent and child table must share at least one unique key (usually the `id`)
     *
     * If there are duplicate column names, it is assumed there
     * is an FK of that column from the child table to the
     * parent table, and that the child's column type is assignable
     * to the parent's column type.
     *
     * An example would be "discriminator" columns used in exclusive
     * inheritance. The parent table could have a column, `appKeyType`,
     * which would be `BROWSER|SERVER`. The child table would, then,
     * have a column called `appKeyType` with `SERVER` as the only value.
     *
     * We outline some possibilities for duplicate columns,
     *
     * Child       | Parent        |
     * generated   | generated     | When inserting, the column value is ignored
     * generated   | has default   | The child column's generated value must be a numeric string
     * generated   | no default    | The child column's generated value must be a numeric string
     *
     * has default | generated     | The parent column must a unique key we can use to retrieve after insertion, to get the value
     * has default | has default   | If value is provided, it'll set both to the value, otherwise, it lets the defaults be set
     * has default | no default    | The value must be provided, it'll set both to the value
     *
     * no default  | generated     | The parent column must a unique key we can use to retrieve after insertion, to get the value
     * no default  | has default   | The parent column must a unique key we can use to retrieve after insertion, to get the value
     * no default  | no default    | The value must be provided, it'll set both to the value
    */
    //readonly parents : DataT["parents"];
}

export type InsertableTable = (
    ITable &
    { insertEnabled : true }
);
export type DeletableTable = (
    ITable &
    { deleteEnabled : true }
);
export type TableWithPrimaryKey = (
    ITable &
    { primaryKey : Key }
);

export type TableWithAutoIncrement = (
    ITable &
    { autoIncrement : string }
);

export type TableWithoutAutoIncrement = (
    ITable &
    { autoIncrement : undefined }
);

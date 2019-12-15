import {TableWithPrimaryKey} from "../table";
import {Key} from "../key";

export interface TablePerTypeData {
    readonly childTable : TableWithPrimaryKey,

    readonly parentTables : readonly TableWithPrimaryKey[],

    readonly autoIncrement : readonly string[],

    readonly explicitAutoIncrementValueEnabled : readonly string[],

    /**
     * Some `parentTables` may not have an `autoIncrement` column.
     *
     * When such a `parentTable` is encountered and
     * we call `TablePerTypeUtil.insertAndFetch()`,
     * we need to provide explicit values for the primary key
     * of the `parentTable`.
     *
     * A value of `readonly never[]` indicates
     * we do not need to specify any primary key.
     */
    readonly insertAndFetchPrimaryKey : Key,
}

export interface ITablePerType<DataT extends TablePerTypeData=TablePerTypeData> {
    /**
     * The "child" table we are currently concerned with.
     *
     * `table extends parentTables`
     */
    readonly childTable : DataT["childTable"];

    /**
     * All other tables higher up the inheritance hierarchy.
     */
    readonly parentTables : DataT["parentTables"];

    /**
     * Multiple columns may be `autoIncrement` in a table-per-type hierarchy.
     */
    readonly autoIncrement : DataT["autoIncrement"];

    readonly explicitAutoIncrementValueEnabled : DataT["explicitAutoIncrementValueEnabled"];

    readonly insertAndFetchPrimaryKey : DataT["insertAndFetchPrimaryKey"];

    /**
     * An array of 2-tuples containing table aliases.
     *
     * It will tell us how to construct `INNER JOIN`s to
     * efficiently query all columns for the `childTable`.
     *
     * We have to be mindful of the following possible
     * inheritance subgraphs,
     *
     * + Linear inheritance
     *   + D extends C extends B extends A
     *
     * + Diamond inheritance
     *   + D extends B extends A
     *   + D extends C extends A
     *
     * + Tree inheritance
     *   + D extends B extends A
     *   + D extends C
     */
    readonly joins : readonly (
        readonly [
            //fromTable
            string,
            //toTable
            string
        ]
    )[];
}

type InsertableTablePerTypeImpl =
    & Omit<ITablePerType, "parentTables">
    & {
        childTable : { insertEnabled : true },
        parentTables : readonly (TableWithPrimaryKey & { insertEnabled : true })[],
    }
;
/**
 * + https://github.com/microsoft/TypeScript/issues/34777#issuecomment-551993933
 * + https://github.com/microsoft/TypeScript/issues/35654
 */
export interface InsertableTablePerType extends InsertableTablePerTypeImpl {

}

type DeletableTablePerTypeImpl =
    & Omit<ITablePerType, "parentTables">
    & {
        childTable : { deleteEnabled : true },
        parentTables : readonly (TableWithPrimaryKey & { deleteEnabled : true })[],
    }
;
/**
 * + https://github.com/microsoft/TypeScript/issues/34777#issuecomment-551993933
 * + https://github.com/microsoft/TypeScript/issues/35654
 */
export interface DeletableTablePerType extends DeletableTablePerTypeImpl {

}

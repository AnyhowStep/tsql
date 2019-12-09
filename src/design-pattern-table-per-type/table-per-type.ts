import {ITable} from "../table";

export interface TablePerTypeData {
    readonly childTable : ITable,

    readonly parentTables : readonly ITable[],

    readonly autoIncrement : readonly string[],

    readonly explicitAutoIncrementValueEnabled : readonly string[],
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

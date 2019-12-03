import {ITable} from "../table";

export interface TablePerTypeData {
    readonly childTable : ITable,

    readonly parentTables : readonly ITable[],
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
}

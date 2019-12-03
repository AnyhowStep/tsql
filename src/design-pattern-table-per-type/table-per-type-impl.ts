import {ITablePerType, TablePerTypeData} from "./table-per-type";
import * as TablePerTypeUtil from "./util";
import {ITable} from "../table";

export class TablePerType<DataT extends TablePerTypeData> implements ITablePerType<DataT> {
    readonly childTable : DataT["childTable"];

    readonly parentTables : DataT["parentTables"];

    constructor (data : DataT) {
        this.childTable = data.childTable;
        this.parentTables = data.parentTables;
    }

    addParent<
        ParentTableT extends ITable|ITablePerType
    > (
        parentTable : ParentTableT
    ) : (
        TablePerTypeUtil.AddParent<this, ParentTableT>
    ) {
        return TablePerTypeUtil.addParent(this, parentTable);
    }
}

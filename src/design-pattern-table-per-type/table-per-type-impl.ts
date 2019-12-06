import {ITablePerType, TablePerTypeData} from "./table-per-type";
import * as TablePerTypeUtil from "./util";
import {ITable} from "../table";
import {SelectConnection, ExecutionUtil} from "../execution";
import {WhereDelegate} from "../where-clause";

export class TablePerType<DataT extends TablePerTypeData> implements ITablePerType<DataT> {
    readonly childTable : DataT["childTable"];

    readonly parentTables : DataT["parentTables"];

    readonly joins : ITablePerType["joins"];

    constructor (
        data : DataT,
        joins : ITablePerType["joins"]
    ) {
        this.childTable = data.childTable;
        this.parentTables = data.parentTables;

        this.joins = joins;
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

    fetchOne (
        connection : SelectConnection,
        whereDelegate : WhereDelegate<TablePerTypeUtil.From<this>["fromClause"]>
    ) : ExecutionUtil.FetchOnePromise<TablePerTypeUtil.Row<this>> {
        return TablePerTypeUtil.fetchOne(
            this,
            connection,
            whereDelegate
        );
    }
}

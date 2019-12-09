import {ITablePerType, TablePerTypeData} from "./table-per-type";
import * as TablePerTypeUtil from "./util";
import {ITable} from "../table";
import {SelectConnection, ExecutionUtil} from "../execution";
import {WhereDelegate} from "../where-clause";

export class TablePerType<DataT extends TablePerTypeData> implements ITablePerType<DataT> {
    readonly childTable : DataT["childTable"];

    readonly parentTables : DataT["parentTables"];

    readonly autoIncrement : DataT["autoIncrement"];

    readonly explicitAutoIncrementValueEnabled : DataT["explicitAutoIncrementValueEnabled"];

    readonly childInsertAndFetchCandidateKeys : DataT["childInsertAndFetchCandidateKeys"];
    readonly parentInsertAndFetchCandidateKeys : DataT["parentInsertAndFetchCandidateKeys"];

    readonly joins : ITablePerType["joins"];

    constructor (
        data : DataT,
        joins : ITablePerType["joins"]
    ) {
        this.childTable = data.childTable;
        this.parentTables = data.parentTables;
        this.autoIncrement = data.autoIncrement;
        this.explicitAutoIncrementValueEnabled = data.explicitAutoIncrementValueEnabled;
        this.childInsertAndFetchCandidateKeys = data.childInsertAndFetchCandidateKeys;
        this.parentInsertAndFetchCandidateKeys = data.parentInsertAndFetchCandidateKeys;

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

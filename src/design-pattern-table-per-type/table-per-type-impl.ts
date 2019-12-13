import {ITablePerType, TablePerTypeData, InsertableTablePerType} from "./table-per-type";
import * as TablePerTypeUtil from "./util";
import {TableWithPrimaryKey} from "../table";
import {SelectConnection, ExecutionUtil, IsolableInsertOneConnection} from "../execution";
import {WhereDelegate} from "../where-clause";
import {OnlyKnownProperties} from "../type-util";

export class TablePerType<DataT extends TablePerTypeData> implements ITablePerType<DataT> {
    readonly childTable : DataT["childTable"];

    readonly parentTables : DataT["parentTables"];

    readonly autoIncrement : DataT["autoIncrement"];

    readonly explicitAutoIncrementValueEnabled : DataT["explicitAutoIncrementValueEnabled"];

    readonly insertAndFetchPrimaryKey : DataT["insertAndFetchPrimaryKey"];

    readonly joins : ITablePerType["joins"];

    constructor (
        data : DataT,
        joins : ITablePerType["joins"]
    ) {
        this.childTable = data.childTable;
        this.parentTables = data.parentTables;
        this.autoIncrement = data.autoIncrement;
        this.explicitAutoIncrementValueEnabled = data.explicitAutoIncrementValueEnabled;
        this.insertAndFetchPrimaryKey = data.insertAndFetchPrimaryKey;

        this.joins = joins;
    }

    addParent<
        ParentTableT extends TableWithPrimaryKey|ITablePerType
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

    insertAndFetch<
        RowT extends TablePerTypeUtil.InsertAndFetchRow<
            Extract<this, InsertableTablePerType>
        >
    > (
        this : Extract<this, InsertableTablePerType>,
        connection : IsolableInsertOneConnection,
        row : OnlyKnownProperties<
            RowT,
            TablePerTypeUtil.InsertAndFetchRow<
                Extract<this, InsertableTablePerType>
            >
        >
    ) : (
        Promise<
            TablePerTypeUtil.InsertedAndFetchedRow<
                Extract<this, InsertableTablePerType>,
                RowT
            >
        >
    ) {
        return TablePerTypeUtil.insertAndFetch(
            this,
            connection,
            row
        );
    }
}

import {ITablePerType, TablePerTypeData, InsertableTablePerType, DeletableTablePerType} from "./table-per-type";
import * as TablePerTypeUtil from "./util";
import {TableWithPrimaryKey} from "../table";
import {SelectConnection, ExecutionUtil, IsolableInsertOneConnection, IsolableUpdateConnection, IsolableDeleteConnection} from "../execution";
import {WhereDelegate} from "../where-clause";
import {OnlyKnownProperties, StrictUnion} from "../type-util";
import {CandidateKey_NonUnion} from "../candidate-key";
import {PrimaryKey_Input} from "../primary-key";

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

    updateAndFetchOneByCandidateKey<
        CandidateKeyT extends StrictUnion<CandidateKey_NonUnion<this["childTable"]>>,
        AssignmentMapT extends TablePerTypeUtil.CustomAssignmentMap<this>
    > (
        connection : IsolableUpdateConnection,
        /**
         * @todo Try and recall why I wanted `AssertNonUnion<>`
         * I didn't write compile-time tests for it...
         */
        candidateKey : CandidateKeyT,// & AssertNonUnion<CandidateKeyT>,
        assignmentMapDelegate : TablePerTypeUtil.AssignmentMapDelegate<this, AssignmentMapT>
    ) : Promise<TablePerTypeUtil.UpdateAndFetchOneReturnType<this, AssignmentMapT>> {
        return TablePerTypeUtil.updateAndFetchOneByCandidateKey(
            this,
            connection,
            candidateKey,
            assignmentMapDelegate
        );
    }

    updateAndFetchOneByPrimaryKey<
        AssignmentMapT extends TablePerTypeUtil.CustomAssignmentMap<this>
    > (
        connection : IsolableUpdateConnection,
        primaryKey : PrimaryKey_Input<this["childTable"]>,
        assignmentMapDelegate : TablePerTypeUtil.AssignmentMapDelegate<this, AssignmentMapT>
    ) : Promise<TablePerTypeUtil.UpdateAndFetchOneReturnType<this, AssignmentMapT>> {
        return TablePerTypeUtil.updateAndFetchOneByPrimaryKey(
            this,
            connection,
            primaryKey,
            assignmentMapDelegate
        );
    }

    updateAndFetchZeroOrOneByCandidateKey<
        CandidateKeyT extends StrictUnion<CandidateKey_NonUnion<this["childTable"]>>,
        AssignmentMapT extends TablePerTypeUtil.CustomAssignmentMap<this>
    > (
        connection : IsolableUpdateConnection,
        /**
         * @todo Try and recall why I wanted `AssertNonUnion<>`
         * I didn't write compile-time tests for it...
         */
        candidateKey : CandidateKeyT,// & AssertNonUnion<CandidateKeyT>,
        assignmentMapDelegate : TablePerTypeUtil.AssignmentMapDelegate<this, AssignmentMapT>
    ) : Promise<TablePerTypeUtil.UpdateAndFetchZeroOrOneReturnType<this, AssignmentMapT>> {
        return TablePerTypeUtil.updateAndFetchZeroOrOneByCandidateKey(
            this,
            connection,
            candidateKey,
            assignmentMapDelegate
        );
    }

    updateAndFetchZeroOrOneByPrimaryKey<
        AssignmentMapT extends TablePerTypeUtil.CustomAssignmentMap<this>
    > (
        connection : IsolableUpdateConnection,
        primaryKey : PrimaryKey_Input<this["childTable"]>,
        assignmentMapDelegate : TablePerTypeUtil.AssignmentMapDelegate<this, AssignmentMapT>
    ) : Promise<TablePerTypeUtil.UpdateAndFetchZeroOrOneReturnType<this, AssignmentMapT>> {
        return TablePerTypeUtil.updateAndFetchZeroOrOneByPrimaryKey(
            this,
            connection,
            primaryKey,
            assignmentMapDelegate
        );
    }

    deleteOneByCandidateKey<
        CandidateKeyT extends StrictUnion<CandidateKey_NonUnion<this["childTable"]>>
    > (
        this : Extract<this, DeletableTablePerType>,
        connection : IsolableDeleteConnection,
        /**
         * @todo Try and recall why I wanted `AssertNonUnion<>`
         * I didn't write compile-time tests for it...
         */
        candidateKey : CandidateKeyT,// & AssertNonUnion<CandidateKeyT>,
    ) : Promise<TablePerTypeUtil.DeleteOneResult> {
        return TablePerTypeUtil.deleteOneByCandidateKey(
            this,
            connection,
            candidateKey
        );
    }
}

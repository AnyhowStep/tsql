import {ITablePerType, TablePerTypeData, InsertableTablePerType, DeletableTablePerType} from "./table-per-type";
import * as TablePerTypeUtil from "./util";
import {TableWithPrimaryKey} from "../table";
import {SelectConnection, ExecutionUtil, IsolableInsertOneConnection, IsolableUpdateConnection, IsolableDeleteConnection} from "../execution";
import {WhereDelegate} from "../where-clause";
import {OnlyKnownProperties, StrictUnion} from "../type-util";
import {CandidateKey_NonUnion} from "../candidate-key";
import {PrimaryKey_Input} from "../primary-key";
import * as ExprLib from "../expr-library";

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

    updateAndFetchOneBySuperKey<
        AssignmentMapT extends TablePerTypeUtil.CustomAssignmentMap<this>
    > (
        connection : IsolableUpdateConnection,
        superKey : TablePerTypeUtil.SuperKey<this>,
        assignmentMapDelegate : TablePerTypeUtil.AssignmentMapDelegate<this, AssignmentMapT>
    ) : Promise<TablePerTypeUtil.UpdateAndFetchOneReturnType<this, AssignmentMapT>> {
        return TablePerTypeUtil.updateAndFetchOneBySuperKey(
            this,
            connection,
            superKey,
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

    updateAndFetchZeroOrOneBySuperKey<
        AssignmentMapT extends TablePerTypeUtil.CustomAssignmentMap<this>
    > (
        connection : IsolableUpdateConnection,
        superKey : TablePerTypeUtil.SuperKey<this>,
        assignmentMapDelegate : TablePerTypeUtil.AssignmentMapDelegate<this, AssignmentMapT>
    ) : Promise<TablePerTypeUtil.UpdateAndFetchZeroOrOneReturnType<this, AssignmentMapT>> {
        return TablePerTypeUtil.updateAndFetchZeroOrOneBySuperKey(
            this,
            connection,
            superKey,
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

    deleteOneByPrimaryKey (
        this : Extract<this, DeletableTablePerType>,
        connection : IsolableDeleteConnection,
        primaryKey : PrimaryKey_Input<Extract<this, DeletableTablePerType>["childTable"]>
    ) : Promise<TablePerTypeUtil.DeleteOneResult> {
        return TablePerTypeUtil.deleteOneByPrimaryKey<Extract<this, DeletableTablePerType>>(
            this,
            connection,
            primaryKey
        );
    }

    deleteOneBySuperKey (
        this : Extract<this, DeletableTablePerType>,
        connection : IsolableDeleteConnection,
        superKey : TablePerTypeUtil.SuperKey<Extract<this, DeletableTablePerType>>
    ) : Promise<TablePerTypeUtil.DeleteOneResult> {
        return TablePerTypeUtil.deleteOneBySuperKey<Extract<this, DeletableTablePerType>>(
            this,
            connection,
            superKey
        );
    }

    deleteZeroOrOneByCandidateKey<
        CandidateKeyT extends StrictUnion<CandidateKey_NonUnion<this["childTable"]>>
    > (
        this : Extract<this, DeletableTablePerType>,
        connection : IsolableDeleteConnection,
        /**
         * @todo Try and recall why I wanted `AssertNonUnion<>`
         * I didn't write compile-time tests for it...
         */
        candidateKey : CandidateKeyT,// & AssertNonUnion<CandidateKeyT>,
    ) : Promise<TablePerTypeUtil.DeleteZeroOrOneResult> {
        return TablePerTypeUtil.deleteZeroOrOneByCandidateKey(
            this,
            connection,
            candidateKey
        );
    }

    deleteZeroOrOneByPrimaryKey (
        this : Extract<this, DeletableTablePerType>,
        connection : IsolableDeleteConnection,
        primaryKey : PrimaryKey_Input<Extract<this, DeletableTablePerType>["childTable"]>
    ) : Promise<TablePerTypeUtil.DeleteZeroOrOneResult> {
        return TablePerTypeUtil.deleteZeroOrOneByPrimaryKey<Extract<this, DeletableTablePerType>>(
            this,
            connection,
            primaryKey
        );
    }

    deleteZeroOrOneBySuperKey (
        this : Extract<this, DeletableTablePerType>,
        connection : IsolableDeleteConnection,
        superKey : TablePerTypeUtil.SuperKey<Extract<this, DeletableTablePerType>>
    ) : Promise<TablePerTypeUtil.DeleteZeroOrOneResult> {
        return TablePerTypeUtil.deleteZeroOrOneBySuperKey<Extract<this, DeletableTablePerType>>(
            this,
            connection,
            superKey
        );
    }

    existsByCandidateKey<
        CandidateKeyT extends StrictUnion<CandidateKey_NonUnion<this["childTable"]>>
    > (
        connection : SelectConnection,
        /**
         * @todo Try and recall why I wanted `AssertNonUnion<>`
         * I didn't write compile-time tests for it...
         */
        candidateKey : CandidateKeyT,// & AssertNonUnion<CandidateKeyT>,
    ) : Promise<boolean> {
        return TablePerTypeUtil.existsImpl(
            this,
            connection,
            () => ExprLib.eqCandidateKey(
                this.childTable,
                candidateKey
            ) as any
        ).then(result => result.exists);
    }

    existsByPrimaryKey (
        connection : SelectConnection,
        primaryKey : PrimaryKey_Input<this["childTable"]>
    ) : Promise<boolean> {
        return TablePerTypeUtil.existsImpl(
            this,
            connection,
            () => ExprLib.eqPrimaryKey(
                this.childTable,
                primaryKey
            ) as any
        ).then(result => result.exists);
    }

    existsBySuperKey (
        connection : SelectConnection,
        superKey : TablePerTypeUtil.SuperKey<this>
    ) : Promise<boolean> {
        return TablePerTypeUtil.existsImpl(
            this,
            connection,
            () => TablePerTypeUtil.eqSuperKey(
                this,
                superKey
            ) as any
        ).then(result => result.exists);
    }

    assertExistsByCandidateKey<
        CandidateKeyT extends StrictUnion<CandidateKey_NonUnion<this["childTable"]>>
    > (
        connection : SelectConnection,
        /**
         * @todo Try and recall why I wanted `AssertNonUnion<>`
         * I didn't write compile-time tests for it...
         */
        candidateKey : CandidateKeyT,// & AssertNonUnion<CandidateKeyT>,
    ) : Promise<void> {
        return TablePerTypeUtil.assertExistsImpl(
            this,
            connection,
            () => ExprLib.eqCandidateKey(
                this.childTable,
                candidateKey
            ) as any
        );
    }

    assertExistsByPrimaryKey (
        connection : SelectConnection,
        primaryKey : PrimaryKey_Input<this["childTable"]>
    ) : Promise<void> {
        return TablePerTypeUtil.assertExistsImpl(
            this,
            connection,
            () => ExprLib.eqPrimaryKey(
                this.childTable,
                primaryKey
            ) as any
        );
    }

    assertExistsBySuperKey (
        connection : SelectConnection,
        superKey : TablePerTypeUtil.SuperKey<this>
    ) : Promise<void> {
        return TablePerTypeUtil.assertExistsImpl(
            this,
            connection,
            () => TablePerTypeUtil.eqSuperKey(
                this,
                superKey
            ) as any
        );
    }
}

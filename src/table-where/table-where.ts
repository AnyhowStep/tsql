import {ITable, DeletableTable} from "../table/table";
import {WhereDelegate} from "../where-clause";
import {
    ExecutionUtil,
    SelectConnection,
    DeleteConnection,
    IsolableDeleteConnection,
    DeleteResult,
    DeleteOneResult,
    DeleteZeroOrOneResult,
    UpdateConnection,
    UpdateResult,
    IsolableUpdateConnection,
} from "../execution";
import {Row_NonUnion} from "../row";
import {SelectClause, SelectDelegate, SelectValueDelegate, SelectClauseUtil} from "../select-clause";
import {FromClauseUtil} from "../from-clause";
import {QueryUtil} from "../unified-query";
import {TableUtil} from "../table";
import {AnyBuiltInExpr} from "../built-in-expr";
import {AssignmentMapDelegate, CustomAssignmentMap} from "../update";
import {ExpandPick} from "../type-util";
import {UpdateOneResult, UpdateZeroOrOneResult} from "../execution/util";
import * as ExprLib from "../expr-library";
/**
 * @todo Implement something like `TableWhereOrderBy`?
 *
 * `.fetchAll()` is not provided here
 * because "proper" usage would minimally require,
 * + `ORDER BY` clause - For deterministic ordering
 * + `LIMIT` clause - To prevent accidental OOMs
 *
 * `.paginate()`, `.emulatedCursor()` are not provided here
 * because "proper" usage of them would minimally require,
 * + `ORDER BY` clause - For deterministic ordering
 *
 */
/**
 * @todo Better name
 * This is basically a `table` + `WHERE` clause.
 */
export class TableWhere<TableT extends ITable> {
    readonly table : TableT;
    readonly whereDelegate : WhereDelegate<
        FromClauseUtil.From<
            FromClauseUtil.NewInstance,
            TableT
        >
    >;

    constructor (
        table : TableT,
        whereDelegate : WhereDelegate<
            FromClauseUtil.From<
                FromClauseUtil.NewInstance,
                TableT
            >
        >
    ) {
        this.table = table;
        this.whereDelegate = whereDelegate;
    }

    where (
        whereDelegate : WhereDelegate<
            FromClauseUtil.From<
                FromClauseUtil.NewInstance,
                TableT
            >
        >
    ) : TableWhere<TableT> {
        return new TableWhere<TableT>(
            this.table,
            (columns) : any => {
                return ExprLib.and(
                    this.whereDelegate(columns),
                    whereDelegate(columns)
                );
            }
        );
    }

    assertExists (
        connection : SelectConnection
    ) : Promise<void> {
        return TableUtil.assertExists(
            this.table,
            connection,
            this.whereDelegate
        );
    }

    exists (
        connection : SelectConnection
    ) : Promise<boolean> {
        return TableUtil.exists(
            this.table,
            connection,
            this.whereDelegate
        );
    }

    fetchOne (
        connection : SelectConnection
    ) : ExecutionUtil.FetchOnePromise<Row_NonUnion<TableT>>;
    fetchOne<
        SelectsT extends SelectClause
    > (
        connection : SelectConnection,
        selectDelegate : SelectDelegate<
            FromClauseUtil.From<
                FromClauseUtil.NewInstance,
                TableT
            >,
            undefined,
            undefined,
            SelectsT
        >
    ) : ExecutionUtil.FetchOneReturnType<
        QueryUtil.Select<
            QueryUtil.From<
                QueryUtil.NewInstance,
                TableT
            >,
            SelectsT
        >
    >;
    fetchOne (
        connection : SelectConnection,
        selectDelegate? : (...args : any[]) => any[]
    ) : ExecutionUtil.FetchOnePromise<any> {
        return TableUtil.__fetchOneHelper(
            this.table,
            connection,
            this.whereDelegate,
            selectDelegate
        );
    }

    fetchValue<
        BuiltInExprT extends AnyBuiltInExpr
    > (
        connection : SelectConnection,
        selectValueDelegate : SelectValueDelegate<
            FromClauseUtil.From<
                FromClauseUtil.NewInstance,
                TableT
            >,
            undefined,
            BuiltInExprT
        >
    ) : ExecutionUtil.FetchValueReturnType<
        /**
         * @todo Report assignability bug to TS issues page
         */
        /*
            QueryUtil.SelectValue<
                QueryUtil.From<
                    QueryUtil.NewInstance,
                    this
                >,
                BuiltInExprT
            >
        */
        QueryUtil.SelectNoSelectClause<
            QueryUtil.From<
                QueryUtil.NewInstance,
                TableT
            >,
            SelectClauseUtil.ValueFromBuiltInExpr<BuiltInExprT>
        >
    > {
        return TableUtil.fetchValue<TableT, BuiltInExprT>(
            this.table,
            connection,
            this.whereDelegate,
            selectValueDelegate
        );
    }

    delete (
        this : Extract<this, { table : DeletableTable }>,
        connection : DeleteConnection
    ) : Promise<DeleteResult> {
        return ExecutionUtil.delete(
            this.table as TableT & DeletableTable,
            connection,
            this.whereDelegate as unknown as WhereDelegate<
                FromClauseUtil.From<
                    FromClauseUtil.NewInstance,
                    TableT & DeletableTable
                >
            >
        );
    }

    deleteOne (
        this : Extract<this, { table : DeletableTable }>,
        connection : IsolableDeleteConnection
    ) : Promise<DeleteOneResult> {
        return ExecutionUtil.deleteOne(
            this.table,
            connection,
            this.whereDelegate as unknown as WhereDelegate<
                FromClauseUtil.From<
                    FromClauseUtil.NewInstance,
                    TableT & DeletableTable
                >
            >
        );
    }

    deleteZeroOrOne (
        this : Extract<this, { table : DeletableTable }>,
        connection : IsolableDeleteConnection
    ) : Promise<DeleteZeroOrOneResult> {
        return ExecutionUtil.deleteZeroOrOne(
            this.table,
            connection,
            this.whereDelegate as unknown as WhereDelegate<
                FromClauseUtil.From<
                    FromClauseUtil.NewInstance,
                    TableT & DeletableTable
                >
            >
        );
    }

    update<
        AssignmentMapT extends CustomAssignmentMap<TableT>
    > (
        connection : UpdateConnection,
        assignmentMapDelegate : AssignmentMapDelegate<ExpandPick<TableT, "columns"|"mutableColumns">, AssignmentMapT>
    ) : Promise<UpdateResult> {
        return ExecutionUtil.update<TableT, AssignmentMapT>(
            this.table,
            connection,
            this.whereDelegate,
            assignmentMapDelegate
        );
    }

    updateOne<
        AssignmentMapT extends CustomAssignmentMap<TableT>
    > (
        connection : IsolableUpdateConnection,
        assignmentMapDelegate : AssignmentMapDelegate<ExpandPick<TableT, "columns"|"mutableColumns">, AssignmentMapT>
    ) : Promise<UpdateOneResult> {
        return ExecutionUtil.updateOne<TableT, AssignmentMapT>(
            this.table,
            connection,
            this.whereDelegate,
            assignmentMapDelegate
        );
    }

    updateZeroOrOne<
        AssignmentMapT extends CustomAssignmentMap<TableT>
    > (
        connection : IsolableUpdateConnection,
        assignmentMapDelegate : AssignmentMapDelegate<ExpandPick<TableT, "columns"|"mutableColumns">, AssignmentMapT>
    ) : Promise<UpdateZeroOrOneResult> {
        return ExecutionUtil.updateZeroOrOne<TableT, AssignmentMapT>(
            this.table,
            connection,
            this.whereDelegate,
            assignmentMapDelegate
        );
    }

    /**
     * The `table` must have at least one `candidateKey` to use this method.
     *
     * Internally,
     * 1. Fetch the candidate key of the row specified by the `WHERE` clause.
     * 2. Calculate what the new candidate key will be after the `UPDATE` statement is run.
     *    (if the candidate key will not be updated, this step is skipped)
     * 3. Run the `UPDATE` statement.
     * 4. Fetch the row using the new candidate key.
     *
     * This algorithm will probably fail if you have triggers that modify the candidate key
     * `ON UPDATE`.
     */
    updateAndFetchOne<
        AssignmentMapT extends ExecutionUtil.UpdateAndFetchOneAssignmentMap<TableT>
    > (
        this : Extract<this, { table : TableT & TableUtil.AssertHasCandidateKey<TableT> }>,
        connection : IsolableUpdateConnection,
        assignmentMapDelegate : AssignmentMapDelegate<TableT, AssignmentMapT>
    ) : Promise<ExecutionUtil.UpdateAndFetchOneResult<TableT, AssignmentMapT>> {
        return ExecutionUtil.updateAndFetchOne<
            TableT,
            AssignmentMapT
        >(
            this.table,
            connection,
            this.whereDelegate,
            assignmentMapDelegate
        );
    }

    /**
     * The `table` must have at least one `candidateKey` to use this method.
     *
     * Internally,
     * 1. Fetch the candidate key of the row specified by the `WHERE` clause.
     * 2. Calculate what the new candidate key will be after the `UPDATE` statement is run.
     *    (if the candidate key will not be updated, this step is skipped)
     * 3. Run the `UPDATE` statement.
     * 4. Fetch the row using the new candidate key (if any were found during the `UPDATE`)
     *
     * This algorithm will probably fail if you have triggers that modify the candidate key
     * `ON UPDATE`.
     */
    updateAndFetchZeroOrOne<
        AssignmentMapT extends ExecutionUtil.UpdateAndFetchOneAssignmentMap<TableT>
    > (
        this : Extract<this, { table : TableT & TableUtil.AssertHasCandidateKey<TableT> }>,
        connection : IsolableUpdateConnection,
        assignmentMapDelegate : AssignmentMapDelegate<TableT, AssignmentMapT>
    ) : Promise<ExecutionUtil.UpdateAndFetchZeroOrOneResult<TableT, AssignmentMapT>> {
        return ExecutionUtil.updateAndFetchZeroOrOne<
            TableT,
            AssignmentMapT
        >(
            this.table,
            connection,
            this.whereDelegate,
            assignmentMapDelegate
        );
    }

}

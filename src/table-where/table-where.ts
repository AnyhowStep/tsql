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
} from "../execution";
import {Row_NonUnion} from "../row";
import {SelectClause, SelectDelegate, SelectValueDelegate, SelectClauseUtil} from "../select-clause";
import {FromClauseUtil} from "../from-clause";
import {QueryUtil} from "../unified-query";
import {TableUtil} from "../table";
import {AnyBuiltInExpr} from "../built-in-expr";
import {AssignmentMapDelegate} from "../update";
import {ExpandPick} from "../type-util";

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

    update (
        connection : UpdateConnection,
        assignmentMapDelegate : AssignmentMapDelegate<ExpandPick<TableT, "columns"|"mutableColumns">>
    ) : Promise<UpdateResult> {
        return ExecutionUtil.update(
            this.table,
            connection,
            this.whereDelegate as any,
            assignmentMapDelegate
        );
    }
}

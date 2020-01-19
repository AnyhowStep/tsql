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
} from "../execution";
import {Row_NonUnion} from "../row";
import {SelectClause, SelectDelegate} from "../select-clause";
import {FromClauseUtil} from "../from-clause";
import {QueryUtil} from "../unified-query";
import {TableUtil} from "../table";

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

}

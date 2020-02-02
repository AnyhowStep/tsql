import {InsertManyResult, IConnection} from "../execution";
import {ITable} from "../table";
import {IEventBase, EventBase} from "./event-base";
import {QueryBaseUtil} from "../query-base";

export interface IInsertSelectEvent<TableT extends ITable> extends IEventBase {
    readonly query : QueryBaseUtil.AfterSelectClause & QueryBaseUtil.NonCorrelated,
    readonly table : TableT;

    /**
     * @todo More precise type for this.
     */
    readonly insertSelectRow : Record<string, unknown>;

    readonly insertResult : InsertManyResult;

    /**
     * Internally, it does a `this.table === table` check.
     */
    isFor<T extends ITable> (table : T) : this is IInsertSelectEvent<T>;
}

export class InsertSelectEvent<TableT extends ITable> extends EventBase implements IInsertSelectEvent<TableT> {
    readonly query : QueryBaseUtil.AfterSelectClause & QueryBaseUtil.NonCorrelated;
    readonly table : TableT;

    /**
     * @todo More precise type for this.
     */
    readonly insertSelectRow : Record<string, unknown>;

    readonly insertResult : InsertManyResult;

    constructor (args : {
        readonly connection : IConnection;

        readonly query : QueryBaseUtil.AfterSelectClause & QueryBaseUtil.NonCorrelated;
        readonly table : TableT;

        readonly insertSelectRow : Record<string, unknown>;

        readonly insertResult : InsertManyResult;
    }) {
        super(args);

        this.query = args.query;
        this.table = args.table;

        this.insertSelectRow = args.insertSelectRow;

        this.insertResult = args.insertResult;
    }

    isFor<T extends ITable> (table : T) : this is IInsertSelectEvent<T> {
        return (this.table as unknown) === table;
    }
}

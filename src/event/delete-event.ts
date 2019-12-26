import {IConnection, DeleteResult} from "../execution";
import {ITable} from "../table";
import {IEventBase, EventBase} from "./event-base";
import {WhereClause} from "../where-clause";

export interface IDeleteEvent<TableT extends ITable> extends IEventBase {
    readonly table : TableT;
    readonly whereClause : WhereClause;

    readonly deleteResult : DeleteResult;

    /**
     * Internally, it does a `this.table === table` check.
     */
    isFor<T extends ITable> (table : T) : this is IDeleteEvent<T>;
}

export class DeleteEvent<TableT extends ITable> extends EventBase implements IDeleteEvent<TableT> {
    readonly table : TableT;
    readonly whereClause : WhereClause;

    readonly deleteResult : DeleteResult;

    constructor (args : {
        readonly connection : IConnection;

        readonly table : TableT;
        readonly whereClause : WhereClause;

        readonly deleteResult : DeleteResult;
    }) {
        super(args);

        this.table = args.table;
        this.whereClause = args.whereClause;

        this.deleteResult = args.deleteResult;
    }

    isFor<T extends ITable> (table : T) : this is IDeleteEvent<T> {
        return (this.table as unknown) === table;
    }
}

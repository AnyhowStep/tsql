import {IConnection, UpdateResult} from "../execution";
import {ITable} from "../table";
import {BuiltInAssignmentMap} from "../update";
import {IEventBase, EventBase} from "./event-base";
import {WhereClause} from "../where-clause";

export interface IUpdateEvent<TableT extends ITable> extends IEventBase {
    readonly table : TableT;
    readonly whereClause : WhereClause;
    readonly assignmentMap : BuiltInAssignmentMap<TableT>;

    readonly updateResult : UpdateResult;

    /**
     * Internally, it does a `this.table === table` check.
     */
    isFor<T extends ITable> (table : T) : this is IUpdateEvent<T>;
}

export class UpdateEvent<TableT extends ITable> extends EventBase implements IUpdateEvent<TableT> {
    readonly table : TableT;
    readonly whereClause : WhereClause;
    readonly assignmentMap : BuiltInAssignmentMap<TableT>;

    readonly updateResult : UpdateResult;

    constructor (args : {
        readonly connection : IConnection;

        readonly table : TableT;
        readonly whereClause : WhereClause;
        readonly assignmentMap : BuiltInAssignmentMap<TableT>;

        readonly updateResult : UpdateResult;
    }) {
        super(args);

        this.table = args.table;
        this.whereClause = args.whereClause;
        this.assignmentMap = args.assignmentMap;

        this.updateResult = args.updateResult;
    }

    isFor<T extends ITable> (table : T) : this is IUpdateEvent<T> {
        return (this.table as unknown) === table;
    }
}

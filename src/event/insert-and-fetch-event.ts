import {InsertOneResult, IConnection} from "../execution";
import {ITable} from "../table";
import {BuiltInInsertRow} from "../insert";
import {Row_Output} from "../row";
import {IEventBase, EventBase} from "./event-base";

export interface IInsertAndFetchEvent<TableT extends ITable> extends IEventBase {
    readonly table : TableT;
    readonly insertRow : BuiltInInsertRow<TableT>;

    readonly insertResult : InsertOneResult;

    readonly fetchedRow : (
        ITable extends TableT ?
        Record<string, unknown> :
        Row_Output<TableT>
    );

    /**
     * Internally, it does a `this.table === table` check.
     */
    isFor<T extends ITable> (table : T) : this is IInsertAndFetchEvent<T>;
}

export class InsertAndFetchEvent<TableT extends ITable> extends EventBase implements IInsertAndFetchEvent<TableT> {
    readonly table : TableT;
    readonly insertRow : BuiltInInsertRow<TableT>;

    readonly insertResult : InsertOneResult;

    readonly fetchedRow : (
        ITable extends TableT ?
        Record<string, unknown> :
        Row_Output<TableT>
    );

    constructor (args : {
        readonly connection : IConnection;

        readonly table : TableT;
        readonly insertRow : BuiltInInsertRow<TableT>;

        readonly insertResult : InsertOneResult;

        readonly fetchedRow : (
            ITable extends TableT ?
            Record<string, unknown> :
            Row_Output<TableT>
        );
    }) {
        super(args);

        this.table = args.table;
        this.insertRow = args.insertRow;

        this.insertResult = args.insertResult;

        this.fetchedRow = args.fetchedRow;
    }

    isFor<T extends ITable> (table : T) : this is IInsertAndFetchEvent<T> {
        return (this.table as unknown) === table;
    }
}

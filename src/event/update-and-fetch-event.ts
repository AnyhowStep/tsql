import {IConnection} from "../execution";
import {ITable} from "../table";
import {BuiltInAssignmentMap} from "../update";
import {IEventBase, EventBase} from "./event-base";
import {UpdateOneResult} from "../execution/util";
import {Row_Output} from "../row";

export interface IUpdateAndFetchEvent<TableT extends ITable> extends IEventBase {
    readonly table : TableT;
    readonly assignmentMap : BuiltInAssignmentMap<TableT>;

    readonly updateResult : (
        & UpdateOneResult
        & {
            row : (
                ITable extends TableT ?
                Record<string, unknown> :
                Row_Output<TableT>
            )
        }
    );

    /**
     * Internally, it does a `this.table === table` check.
     */
    isFor<T extends ITable> (table : T) : this is IUpdateAndFetchEvent<T>;
}

export class UpdateAndFetchEvent<TableT extends ITable> extends EventBase implements IUpdateAndFetchEvent<TableT> {
    readonly table : TableT;
    readonly assignmentMap : BuiltInAssignmentMap<TableT>;

    readonly updateResult : (
        & UpdateOneResult
        & {
            row : (
                ITable extends TableT ?
                Record<string, unknown> :
                Row_Output<TableT>
            )
        }
    );

    constructor (args : {
        readonly connection : IConnection;

        readonly table : TableT;
        readonly assignmentMap : BuiltInAssignmentMap<TableT>;

        readonly updateResult : (
            & UpdateOneResult
            & {
                row : (
                    ITable extends TableT ?
                    Record<string, unknown> :
                    Row_Output<TableT>
                )
            }
        );
    }) {
        super(args);

        this.table = args.table;
        this.assignmentMap = args.assignmentMap;

        this.updateResult = args.updateResult;
    }

    isFor<T extends ITable> (table : T) : this is IUpdateAndFetchEvent<T> {
        return (this.table as unknown) === table;
    }
}

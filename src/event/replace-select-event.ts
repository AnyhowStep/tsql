import {ReplaceManyResult, IConnection} from "../execution";
import {ITable} from "../table";
import {IEventBase, EventBase} from "./event-base";
import {QueryBaseUtil} from "../query-base";

export interface IReplaceSelectEvent<TableT extends ITable> extends IEventBase {
    readonly query : QueryBaseUtil.AfterSelectClause & QueryBaseUtil.NonCorrelated,
    readonly table : TableT;

    /**
     * @todo More precise type for this.
     */
    readonly replaceSelectRow : Record<string, unknown>;

    readonly replaceResult : ReplaceManyResult;

    /**
     * Internally, it does a `this.table === table` check.
     */
    isFor<T extends ITable> (table : T) : this is IReplaceSelectEvent<T>;
}

export class ReplaceSelectEvent<TableT extends ITable> extends EventBase implements IReplaceSelectEvent<TableT> {
    readonly query : QueryBaseUtil.AfterSelectClause & QueryBaseUtil.NonCorrelated;
    readonly table : TableT;

    /**
     * @todo More precise type for this.
     */
    readonly replaceSelectRow : Record<string, unknown>;

    readonly replaceResult : ReplaceManyResult;

    constructor (args : {
        readonly connection : IConnection;

        readonly query : QueryBaseUtil.AfterSelectClause & QueryBaseUtil.NonCorrelated;
        readonly table : TableT;

        readonly replaceSelectRow : Record<string, unknown>;

        readonly replaceResult : ReplaceManyResult;
    }) {
        super(args);

        this.query = args.query;
        this.table = args.table;

        this.replaceSelectRow = args.replaceSelectRow;

        this.replaceResult = args.replaceResult;
    }

    isFor<T extends ITable> (table : T) : this is IReplaceSelectEvent<T> {
        return (this.table as unknown) === table;
    }
}

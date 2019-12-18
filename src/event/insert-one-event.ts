import * as tm from "type-mapping";
import {InsertOneResult, IPool, IConnection} from "../execution";
import {ITable} from "../table";
import {BuiltInInsertRow} from "../insert";
import {CandidateKey_Output, CandidateKeyUtil} from "../candidate-key";
import {IEventBase, EventBase} from "./pool-event-emitter";

export interface IInsertOneEvent<TableT extends ITable> extends IEventBase {
    readonly table : TableT;

    readonly insertResult : InsertOneResult;
    readonly insertRow : BuiltInInsertRow<TableT>;

    /**
     * If we can get the `candidateKey` from the `insertRow`, this will be set.
     * This is only possible if at least one candidate key is set using just
     * value expressions, on the `insertRow`.
     */
    readonly candidateKey : undefined|(
        ITable extends TableT ?
        Record<string, unknown> :
        CandidateKey_Output<TableT>
    );

    /**
     * Internally, it does a `this.table === table` check.
     */
    isFor<T extends ITable> (table : T) : this is IInsertOneEvent<T>;
}

export class InsertOneEvent<TableT extends ITable> extends EventBase implements IInsertOneEvent<TableT> {
    readonly table : TableT;

    readonly insertResult : InsertOneResult;
    readonly insertRow : BuiltInInsertRow<TableT>;

    private candidateKeyCache : (
        | "uninitialized"
        | undefined
        | (
            ITable extends TableT ?
            Record<string, unknown> :
            CandidateKey_Output<TableT>
        )
    ) = "uninitialized";

    get candidateKey () : undefined|(
        ITable extends TableT ?
        Record<string, unknown> :
        CandidateKey_Output<TableT>
    ) {
        if (this.candidateKeyCache == "uninitialized") {
            const candidateKeyResult = tm.tryMapHandled(
                CandidateKeyUtil.mapperPreferPrimaryKey(this.table),
                `${this.table.alias}.candidateKey`,
                this.insertRow
            );
            this.candidateKeyCache = candidateKeyResult.success ?
                candidateKeyResult.value  as unknown as (
                    ITable extends TableT ?
                    Record<string, unknown> :
                    CandidateKey_Output<TableT>
                ) :
                undefined;
        }
        return this.candidateKeyCache;

    }

    constructor (args : {
        readonly pool : IPool;
        readonly connection : IConnection;

        readonly table : TableT;

        readonly insertResult : InsertOneResult;
        readonly insertRow : BuiltInInsertRow<TableT>;
    }) {
        super(args);

        this.table = args.table;

        this.insertResult = args.insertResult;
        this.insertRow = args.insertRow;
    }

    isFor<T extends ITable> (table : T) : this is IInsertOneEvent<T> {
        return (this.table as unknown) === table;
    }
}

import * as tm from "type-mapping";
import {InsertOneResult, IPool, IConnection} from "../execution";
import {ITable, TableUtil} from "../table";
import {BuiltInInsertRow} from "../insert";
import {CandidateKey_Output, CandidateKeyUtil} from "../candidate-key";
import {IEventBase, EventBase} from "./pool-event-emitter";
import {Row_Output} from "../row";
import * as ExprLib from "../expr-library";

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
     * This may throw for a number of reasons,
     * + `candidateKey` is `undefined` (cannot be derived from `insertRow`)
     * + Row was updated to a different `candidateKey` value before initial fetch
     * + Connection released
     * + etc.
     *
     * First call to `getOrFetch()` fetches the row.
     * Subsequent calls return a cached copy of the row.
     */
    getOrFetch () : Promise<(
        ITable extends TableT ?
        Record<string, unknown> :
        Row_Output<TableT>
    )>;

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

    private fetchPromise : undefined|Promise<(
        ITable extends TableT ?
        Record<string, unknown> :
        Row_Output<TableT>
    )>;
    async getOrFetch () : Promise<(
        ITable extends TableT ?
        Record<string, unknown> :
        Row_Output<TableT>
    )> {
        if (this.fetchPromise == undefined) {
            const candidateKey = this.candidateKey;
            if (candidateKey == undefined) {
                throw new Error(`Could not derive candidateKey from insertRow`);
            }
            this.fetchPromise = TableUtil.fetchOne(
                this.table,
                this.connection,
                () => ExprLib.eqCandidateKey(
                    this.table,
                    candidateKey as any
                ) as any
            ) as Promise<unknown> as Promise<(
                ITable extends TableT ?
                Record<string, unknown> :
                Row_Output<TableT>
            )>;
        }
        return this.fetchPromise;
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

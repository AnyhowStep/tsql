import * as tm from "type-mapping";
import {ReplaceManyResult, IConnection} from "../execution";
import {ITable, TableUtil} from "../table";
import {BuiltInInsertRow} from "../insert";
import {CandidateKey_Output, CandidateKeyUtil} from "../candidate-key";
import {Row_Output} from "../row";
import * as ExprLib from "../expr-library";
import {IEventBase, EventBase} from "./event-base";

export interface IReplaceEvent<TableT extends ITable> extends IEventBase {
    readonly table : TableT;
    /**
     * Guaranteed to contain at least one row.
     */
    readonly insertRows : readonly [BuiltInInsertRow<TableT>, ...BuiltInInsertRow<TableT>[]];

    readonly replaceResult : ReplaceManyResult;

    /**
     * If we can get the `candidateKey` from the `insertRow`, this will be set.
     * This is only possible if at least one candidate key is set using just
     * value expressions, on the `insertRow`.
     */
    readonly candidateKeys : readonly [
        undefined|(
            ITable extends TableT ?
            Record<string, unknown> :
            CandidateKey_Output<TableT>
        ),
        ...(
            undefined|(
                ITable extends TableT ?
                Record<string, unknown> :
                CandidateKey_Output<TableT>
            )
        )[]
    ];

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
    getOrFetch (index : number) : Promise<(
        ITable extends TableT ?
        Record<string, unknown> :
        Row_Output<TableT>
    )>;

    /**
     * Internally, it does a `this.table === table` check.
     */
    isFor<T extends ITable> (table : T) : this is IReplaceEvent<T>;
}

declare global {
    interface Array<T> {
        map<U>(
            this : [T, ...T[]],
            callbackfn: (value: T, index: number, array: ReadonlyArray<T>) => U,
            thisArg?: any
        ): [U, ...U[]];
        map<U>(
            callbackfn: (value: T, index: number, array: ReadonlyArray<T>) => U,
            thisArg?: any
        ): U[];
    }
    interface ReadonlyArray<T> {
        map<U>(
            this : readonly [T, ...T[]],
            callbackfn: (value: T, index: number, array: ReadonlyArray<T>) => U,
            thisArg?: any
        ): [U, ...U[]];
    }
}

export class ReplaceEvent<TableT extends ITable> extends EventBase implements IReplaceEvent<TableT> {
    readonly table : TableT;
    /**
     * Guaranteed to contain at least one row.
     */
    readonly insertRows : readonly [BuiltInInsertRow<TableT>, ...BuiltInInsertRow<TableT>[]];

    readonly replaceResult : ReplaceManyResult;

    private candidateKeysCache : undefined|readonly [
        undefined|(
            ITable extends TableT ?
            Record<string, unknown> :
            CandidateKey_Output<TableT>
        ),
        ...(
            undefined|(
                ITable extends TableT ?
                Record<string, unknown> :
                CandidateKey_Output<TableT>
            )
        )[]
    ] = undefined;

    get candidateKeys () : readonly [
        undefined|(
            ITable extends TableT ?
            Record<string, unknown> :
            CandidateKey_Output<TableT>
        ),
        ...(
            undefined|(
                ITable extends TableT ?
                Record<string, unknown> :
                CandidateKey_Output<TableT>
            )
        )[]
    ] {
        if (this.candidateKeysCache == undefined) {
            const mapper = CandidateKeyUtil.mapperPreferPrimaryKey(this.table);
            this.candidateKeysCache = this.insertRows.map(insertRow => {
                const candidateKeyResult = tm.tryMapHandled(
                    mapper,
                    `${this.table.alias}.candidateKey`,
                    insertRow
                );
                return candidateKeyResult.success ?
                    candidateKeyResult.value  as unknown as (
                        ITable extends TableT ?
                        Record<string, unknown> :
                        CandidateKey_Output<TableT>
                    ) :
                    undefined;
            });
        }
        return this.candidateKeysCache;
    }

    private fetchPromises : {
        [index : number] : undefined|Promise<(
            ITable extends TableT ?
            Record<string, unknown> :
            Row_Output<TableT>
        )>
    } = {};
    async getOrFetch (index : number) : Promise<(
        ITable extends TableT ?
        Record<string, unknown> :
        Row_Output<TableT>
    )> {
        let fetchPromise = this.fetchPromises[index];

        if (fetchPromise == undefined) {
            const candidateKey = this.candidateKeys[index];
            if (candidateKey == undefined) {
                /**
                 * @todo Custom Error type
                 */
                throw new Error(`Could not derive candidateKey ${index} from insertRow ${index}`);
            }
            fetchPromise = TableUtil.fetchOne(
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

            this.fetchPromises[index] = fetchPromise;
        }

        return fetchPromise;
    }

    constructor (args : {
        readonly connection : IConnection;

        readonly table : TableT;
        readonly insertRows : readonly [BuiltInInsertRow<TableT>, ...BuiltInInsertRow<TableT>[]];

        readonly replaceResult : ReplaceManyResult;
    }) {
        super(args);

        this.table = args.table;
        this.insertRows = args.insertRows;

        this.replaceResult = args.replaceResult;
    }

    isFor<T extends ITable> (table : T) : this is IReplaceEvent<T> {
        return (this.table as unknown) === table;
    }
}

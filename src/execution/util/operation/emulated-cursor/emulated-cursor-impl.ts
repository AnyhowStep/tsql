import * as tm from "type-mapping";
import {QueryBaseUtil} from "../../../../query-base";
import {FetchAllConnection, FetchedRow} from "../../helper-type";
import {RawPaginateArgs, toPaginateArgs, Paginate, paginate} from "../paginate";
import {EmulatedCursor} from "./emulated-cursor";

//In case Symbol.asyncIterator is not defined
if (Symbol.asyncIterator == undefined) {
    Object.defineProperty(Symbol, "asyncIterator", {
        value : Symbol.for("Symbol.asyncIterator")
    });
}

export class EmulatedCursorImpl<
    QueryT extends QueryBaseUtil.AfterSelectClause & QueryBaseUtil.NonCorrelated
> implements EmulatedCursor<QueryT> {
    private readonly query : QueryT;
    private readonly connection : FetchAllConnection<QueryT>;

    private readonly startPage : bigint;
    private readonly rowsPerPage : bigint;
    private readonly rowOffset : bigint;

    /**
     * This is a number because we'll be performing
     * array index access.
     */
    private rowIndex : number;
    private buffer : Paginate<QueryT>|undefined = undefined;

    private BigInt : (n : number) => bigint;

    constructor (
        query : QueryT,
        connection : FetchAllConnection<QueryT>,
        rawArgs : RawPaginateArgs
    ) {
        this.query = query;
        this.connection = connection;

        const args = toPaginateArgs(rawArgs);
        this.startPage = args.page;
        this.rowsPerPage = args.rowsPerPage;
        this.rowOffset = args.rowOffset;


        this.BigInt = tm.TypeUtil.getBigIntFactoryFunctionOrError();
        this.rowIndex = 0;

        if (tm.BigIntUtil.greaterThan(this.rowsPerPage, Number.MAX_SAFE_INTEGER)) {
            throw new Error(`Cannot safely emulate cursor when buffer size is greater than ${Number.MAX_SAFE_INTEGER}`);
        }
    }

    private async getOrFetchBuffer () : Promise<Paginate<QueryT>> {
        if (this.buffer == undefined) {
            this.rowIndex = 0;
            this.buffer = await paginate(
                this.query,
                this.connection,
                {
                    page : this.startPage,
                    rowsPerPage : this.rowsPerPage,
                    rowOffset : this.rowOffset,
                }
            );
        }
        return this.buffer;
    }
    private async tryGetNextRow () : Promise<FetchedRow<QueryT>|undefined> {
        const buffer = await this.getOrFetchBuffer();
        if (this.rowIndex < buffer.rows.length) {
            const row = buffer.rows[this.rowIndex];
            ++this.rowIndex;
            return row;
        } else {
            return undefined;
        }
    }
    private async tryFetchNextPage () : Promise<Paginate<QueryT>|undefined> {
        const buffer = await this.getOrFetchBuffer();
        const nextPage =  tm.BigIntUtil.add(buffer.info.page, this.BigInt(1));
        if (tm.BigIntUtil.lessThan(nextPage, buffer.info.pagesFound)) {
            this.rowIndex = 0;
            this.buffer = await paginate(
                this.query,
                this.connection,
                {
                    page : nextPage,
                    rowsPerPage : this.rowsPerPage,
                    rowOffset : this.rowOffset,
                }
            );
            return buffer;
        } else {
            return undefined;
        }
    }
    async next () : Promise<IteratorResult<FetchedRow<QueryT>>> {
        /**
         * Try and get the next row of the current page
         */
        const row = await this.tryGetNextRow();
        if (row !== undefined) {
            return {
                done : false,
                value : row,
            };
        }

        /**
         * If we're here, we passed the end of the current page
         */
        {
            await this.tryFetchNextPage();
            const row = await this.tryGetNextRow();
            if (row !== undefined) {
                return {
                    done : false,
                    value : row,
                };
            } else {
                /**
                 * We passed the end of the last page
                 */
                return {
                    done : true,
                    /**
                     * The `IteratorResult<>` type really needs to be updated...
                     */
                    value : undefined as any,
                };
            }
        }
    }

    [Symbol.asyncIterator]() {
        return this;
    }
}

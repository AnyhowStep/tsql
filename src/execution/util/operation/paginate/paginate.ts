import {QueryBaseUtil} from "../../../../query-base";
import {FetchAllConnection, FetchedRow} from "../../helper-type";
import {fetchAllImpl} from "../impl";
import {RawPaginateArgs, toPaginateArgs, calculatePagesFound} from "./paginate-args";
import {applyPaginateArgs} from "./apply-paginate-args";
import {count} from "../count";
import {removePaginateArgs} from "./remove-paginate-args";

export interface PaginateInfo {
    rowsFound : bigint,
    pagesFound : bigint,
    page : bigint,
    rowsPerPage : bigint,
}
export interface PaginateResult<T> {
    info : PaginateInfo,
    rows : T[],
}

export type Paginate<
    QueryT extends QueryBaseUtil.AfterSelectClause & QueryBaseUtil.NonCorrelated
> = (
    PaginateResult<FetchedRow<QueryT>>
);

export async function paginate<
    QueryT extends QueryBaseUtil.AfterSelectClause & QueryBaseUtil.NonCorrelated
>(
    query : QueryT,
    connection : FetchAllConnection<QueryT>,
    rawArgs : RawPaginateArgs
) : Promise<Paginate<QueryT>> {
    const args = toPaginateArgs(rawArgs);
    const paginateQuery = applyPaginateArgs(query, args);

    const fetched = await fetchAllImpl(paginateQuery, connection);
    const rowsFound = await count(
        removePaginateArgs(paginateQuery),
        connection
    );
    const pagesFound = calculatePagesFound(args, rowsFound);
    const info = {
        rowsFound,
        pagesFound,
        page : args.page,
        rowsPerPage : args.rowsPerPage,
    };
    return {
        info,
        /**
         * @todo Investigate assignability
         */
        rows : fetched.resultSet as FetchedRow<QueryT>[],
    };
}

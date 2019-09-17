import {FetchAllConnection, FetchedRow} from "../helper-type";
import {QueryBaseUtil} from "../../../query-base";
import {RowNotFoundError} from "../../../error";
import {fetchOneOrUndefinedImpl} from "./fetch-one-or-undefined-impl";

export async function fetchOneImpl<
    QueryT extends QueryBaseUtil.AfterSelectClause & QueryBaseUtil.NonCorrelated
>(
    query : QueryT,
    connection : FetchAllConnection<QueryT>
) : (
    Promise<{
        sql : string,
        row : FetchedRow<QueryT>,
    }>
) {
    const fetched = await fetchOneOrUndefinedImpl<QueryT>(query, connection);
    const row = fetched.row;
    if (row === undefined) {
        if (query.fromClause.currentJoins == undefined || query.fromClause.currentJoins.length == 0) {
            throw new RowNotFoundError(`Expected one row, found zero`, fetched.sql);
        } else {
            throw new RowNotFoundError(`Expected one row from ${query.fromClause.currentJoins[0].tableAlias}, found zero`, fetched.sql);
        }
    } else {
        return {
            sql : fetched.sql,
            row,
        };
    }
}

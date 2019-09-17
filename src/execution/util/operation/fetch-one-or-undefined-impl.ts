import {FetchAllConnection, FetchedRow} from "../helper-type";
import {QueryBaseUtil} from "../../../query-base";
import {LimitClauseUtil} from "../../../limit-clause";
import {TooManyRowsFoundError} from "../../../error";
import {fetchAllImpl} from "./fetch-all-impl";

export async function fetchOneOrUndefinedImpl<
    QueryT extends QueryBaseUtil.AfterSelectClause & QueryBaseUtil.NonCorrelated
>(
    query : QueryT,
    connection : FetchAllConnection<QueryT>
) : (
    Promise<{
        sql : string,
        row : FetchedRow<QueryT>|undefined,
    }>
) {
    /**
     * We use `LIMIT 2`,
     * because if we fetch more than one row,
     * we've messed up.
     *
     * But I don't want to fetch 1 million rows if we mess up.
     * This limits our failure.
     */
    const limitedQuery : QueryT = (
        query.compoundQueryClause == undefined ?
        (
            query.limitClause == undefined ?
            {
                ...query,
                limitClause : LimitClauseUtil.limitNumber(undefined, 2),
            } :
            /**
             * The user already specified a custom limit.
             * We don't want to mess with it.
             */
            query
        ) :
        (
            query.compoundQueryLimitClause == undefined ?
            {
                ...query,
                compoundQueryLimitClause : LimitClauseUtil.limitNumber(undefined, 2),
            } :
            /**
             * The user already specified a custom limit.
             * We don't want to mess with it.
             */
            query
        )
    );

    const fetched = await fetchAllImpl<QueryT>(limitedQuery, connection);
    const resultSet = fetched.resultSet;
    if (resultSet.length == 0) {
        return {
            sql : fetched.sql,
            row : undefined,
        };
    } else if (resultSet.length == 1) {
        return {
            sql : fetched.sql,
            row : resultSet[0],
        };
    } else {
        if (query.fromClause.currentJoins == undefined || query.fromClause.currentJoins.length == 0) {
            throw new TooManyRowsFoundError(`Expected zero or one row, fetched more than that`, fetched.sql);
        } else {
            throw new TooManyRowsFoundError(`Expected zero or one row from ${query.fromClause.currentJoins[0].tableAlias}, fetched more than that`, fetched.sql);
        }
    }
}

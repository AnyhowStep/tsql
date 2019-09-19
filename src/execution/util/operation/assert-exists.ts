import {QueryBaseUtil} from "../../../query-base";
import {SelectConnection} from "../../connection";
import {RowNotFoundError} from "../../../error";
import {existsImpl} from "./impl";

export async function assertExists (
    query : QueryBaseUtil.NonCorrelated & (QueryBaseUtil.AfterFromClause|QueryBaseUtil.AfterSelectClause),
    connection : SelectConnection
) : Promise<void> {
    const result = await existsImpl(query, connection);
    if (!result.exists) {
        if (query.fromClause.currentJoins == undefined || query.fromClause.currentJoins.length == 0) {
            throw new RowNotFoundError(`Row does not exist`, result.sql);
        } else {
            throw new RowNotFoundError(`Row of ${query.fromClause.currentJoins[0].tableAlias} does not exist`, result.sql);
        }
    }
}

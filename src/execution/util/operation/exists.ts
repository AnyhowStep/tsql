import {QueryBaseUtil} from "../../../query-base";
import {SelectConnection} from "../../connection";
import {existsImpl} from "./impl";

export async function exists (
    query : QueryBaseUtil.NonCorrelated & (QueryBaseUtil.AfterFromClause|QueryBaseUtil.AfterSelectClause),
    connection : SelectConnection
) : Promise<boolean> {
    return existsImpl(query, connection)
        .then(({exists}) => exists);
}

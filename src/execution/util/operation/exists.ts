import {QueryBaseUtil} from "../../../query-base";
import {SelectConnection} from "../../connection";
import {QueryUtil} from "../../../unified-query";
import * as ExprLib from "../../../expr-library";

export async function exists (
    query : QueryBaseUtil.NonCorrelated & (QueryBaseUtil.AfterFromClause|QueryBaseUtil.AfterSelectClause),
    connection : SelectConnection
) : Promise<boolean> {
    return QueryUtil.newInstance()
        .selectValue(() => ExprLib.exists(query))
        .fetchValue(connection);
}

import {QueryBaseUtil} from "../../../../query-base";
import {SelectConnection} from "../../../connection";
import {QueryUtil} from "../../../../unified-query";
import * as ExprLib from "../../../../expr-library";
import {fetchValueImpl} from "./fetch-value-impl";

export async function existsImpl (
    query : QueryBaseUtil.NonCorrelated & (QueryBaseUtil.AfterFromClause|QueryBaseUtil.AfterSelectClause),
    connection : SelectConnection
) : (
    Promise<{
        sql : string,
        exists : boolean,
    }>
) {
    const fetched = await fetchValueImpl(
        QueryUtil.newInstance()
            .selectValue(() => ExprLib.exists(query)),
        connection
    );
    return {
        sql : fetched.sql,
        exists : fetched.value,
    };
}

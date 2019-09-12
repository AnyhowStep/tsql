import {QueryBaseUtil} from "../../../query-base";
import {IQuery} from "../../query";

export type AfterSelectClause = (
    & QueryBaseUtil.AfterSelectClause
    & IQuery
);

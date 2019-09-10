import {QueryBaseUtil} from "../../../query-base";
import {IQuery} from "../../query";

export type BeforeFromClause = (
    & QueryBaseUtil.BeforeFromClause
    & IQuery
);

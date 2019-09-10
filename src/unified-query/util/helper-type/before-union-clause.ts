import {QueryBaseUtil} from "../../../query-base";
import {IQuery} from "../../query";

export type BeforeUnionClause = (
    & QueryBaseUtil.BeforeUnionClause
    & IQuery
);

import {QueryBaseUtil} from "../../../query-base";
import {UnmappedRow} from "./unmapped-row";

export type UnmappedResultSet<
    QueryT extends QueryBaseUtil.AfterSelectClause & QueryBaseUtil.NonCorrelated
> = (
    UnmappedRow<QueryT>[]
);

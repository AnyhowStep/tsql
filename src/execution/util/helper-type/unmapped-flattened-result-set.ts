import {QueryBaseUtil} from "../../../query-base";
import {UnmappedFlattenedRow} from "./unmapped-flattened-row";

export type UnmappedFlattenedResultSet<
    QueryT extends QueryBaseUtil.AfterSelectClause & QueryBaseUtil.NonCorrelated
> = (
    UnmappedFlattenedRow<QueryT>[]
);

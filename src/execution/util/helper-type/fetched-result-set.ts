import {QueryBaseUtil} from "../../../query-base";
import {FetchedRow} from "./fetched-row";

export type FetchedResultSet<
    QueryT extends Pick<QueryBaseUtil.AfterSelectClause, "selectClause"|"fromClause"|"mapDelegate">
> =
    FetchedRow<QueryT>[]
;

import {QueryBaseUtil} from "../../../query-base";
import {MapDelegate} from "../../../map-delegate";
import {MappedRow} from "./mapped-row";
import {UnmappedFlattenedRow} from "./unmapped-flattened-row";

export type FetchedRow<
    QueryT extends Pick<QueryBaseUtil.AfterSelectClause, "selectClause"|"fromClause"|"mapDelegate">
> =
    QueryT["mapDelegate"] extends MapDelegate ?
    MappedRow<Extract<QueryT, QueryBaseUtil.Mapped>> :
    UnmappedFlattenedRow<QueryT>
;

import {QueryBaseUtil} from "../../../query-base";
import {MapDelegate} from "../../../map-delegate";
import {IsolableSelectConnection, SelectConnection} from "../../connection";

/**
 * The `IConnection` subtype to use for `fetchAll()`
 */
export type FetchAllConnection<
    QueryT extends Pick<QueryBaseUtil.AfterSelectClause, "mapDelegate">
> =
    QueryT["mapDelegate"] extends MapDelegate ?
    IsolableSelectConnection :
    SelectConnection
;

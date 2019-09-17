import {QueryBaseUtil} from "../../../query-base";
import {MapDelegate} from "../../../map-delegate";
import {IsolableSelectConnection, SelectConnection} from "../../connection";

/**
 * The `IConnection` subtype to use for `fetchAll()`
 *
 * @todo Consider renaming this to something else.
 * Like `FetchConnection`
 */
export type FetchAllConnection<
    QueryT extends Pick<QueryBaseUtil.AfterSelectClause, "mapDelegate">
> =
    QueryT["mapDelegate"] extends MapDelegate ?
    IsolableSelectConnection :
    SelectConnection
;

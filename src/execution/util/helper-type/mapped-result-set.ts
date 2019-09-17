import {QueryBaseUtil} from "../../../query-base";
import {MappedRow} from "./mapped-row";

export type MappedResultSet<
    QueryT extends Pick<QueryBaseUtil.Mapped, "mapDelegate">
> = (
    MappedRow<QueryT>[]
);

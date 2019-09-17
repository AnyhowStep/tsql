import {BetterReturnType, TypeOfAwait} from "../../../type-util";
import {QueryBaseUtil} from "../../../query-base";

export type MappedRow<
    QueryT extends Pick<QueryBaseUtil.Mapped, "mapDelegate">
> =
    TypeOfAwait<BetterReturnType<QueryT["mapDelegate"]>>
;

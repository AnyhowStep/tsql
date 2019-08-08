import {IJoin} from "../../../join";
import {ColumnMapUtil} from "../../../column-map";
import {FromColumnMap, fromColumnMap} from "./from-column-map";
import {IColumn} from "../../column";

export type FromJoin<JoinT extends IJoin> = (
    JoinT extends IJoin ?
    FromColumnMap<
        ColumnMapUtil.FromJoin<JoinT>
    > :
    never
);
export function fromJoin<
    JoinT extends IJoin
> (
    join : JoinT
) : (
    FromJoin<JoinT>[]
) {
    const result : IColumn[] = fromColumnMap(
        ColumnMapUtil.fromJoin(join)
    );
    return result as FromJoin<JoinT>[];
}

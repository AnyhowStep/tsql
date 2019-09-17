import {MapDelegate} from "../../map-delegate";
import {TypeOfAwait} from "../../../type-util";
import {IsolableSelectConnection} from "../../../execution";

export type Compose<
    OriginalRowT,
    NxtReturnT
> =
    MapDelegate<OriginalRowT, OriginalRowT, Promise<TypeOfAwait<NxtReturnT>>>
;

export function compose<
    OriginalRowT,
    ReturnT,
    NxtReturnT
> (
    cur : MapDelegate<OriginalRowT, OriginalRowT, ReturnT>,
    nxt : MapDelegate<TypeOfAwait<ReturnT>, OriginalRowT, NxtReturnT>
) : (
    Compose<OriginalRowT, NxtReturnT>
) {
    return async (row : OriginalRowT, connection : IsolableSelectConnection, originalRow : OriginalRowT) : Promise<TypeOfAwait<NxtReturnT>> => {
        const tmp = await cur(row, connection, originalRow) as TypeOfAwait<ReturnT>;
        const result = await nxt(tmp, connection, originalRow) as TypeOfAwait<NxtReturnT>;
        return result;
    };
}

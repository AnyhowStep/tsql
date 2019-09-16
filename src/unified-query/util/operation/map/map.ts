import {AfterSelectClause, NonCorrelated, Unmapped, Mapped} from "../../helper-type";
import {InitialMapDelegate, MapInitial, mapInitial} from "./map-initial";
import {ComposedMapDelegate, MapCompose, mapCompose} from "./map-compose";
import {MapDelegate} from "../../../../map-delegate";

export function map<
    QueryT extends AfterSelectClause & NonCorrelated & Unmapped,
    NxtReturnT
> (
    query : QueryT,
    mapDelegate : InitialMapDelegate<QueryT, NxtReturnT>
) : (
    MapInitial<QueryT, NxtReturnT>
);
export function map<
    QueryT extends AfterSelectClause & NonCorrelated & Mapped,
    NxtReturnT
> (
    query : QueryT,
    mapDelegate : ComposedMapDelegate<QueryT, NxtReturnT>
) : (
    MapCompose<QueryT, NxtReturnT>
);
/**
 * @todo Clean up usages of `any`
 *
 * Removing the usages of `any` will cause build times to jump 30s!
 */
export function map (
    query : AfterSelectClause & NonCorrelated,
    mapDelegate : MapDelegate
) : any {
    if (query.mapDelegate == undefined) {
        return mapInitial(query as any, mapDelegate as any) as any;
    } else {
        return mapCompose(query as any, mapDelegate as any) as any;
    }
}

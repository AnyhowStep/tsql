import {Key} from "../../key";
import {ColumnMap} from "../../../column-map";

/**
 * + Assumes `KeyT` may be a union
 * + Assumes `ColumnMapT` may be a union
 *
 * Extracts all `KeyT` that exist in all `ColumnMapT`.
 *
 * If a given `KeyT` does not exist in some `ColumnMapT`, it is not part of the result.
 */
export type ExtractIfInColumnMap<
    KeyT extends Key,
    ColumnMapT extends ColumnMap
> = (
    KeyT extends Key ?
    (
        /**
         * keyof ({ x:string,y:string }|{ x:string,z:string }) === "x"
         */
        KeyT[number] extends keyof ColumnMapT ?
        KeyT :
        never
    ) :
    never
);

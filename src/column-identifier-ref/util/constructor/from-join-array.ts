import {IJoin} from "../../../join";
import {WritableColumnIdentifierRef} from "../../column-identifier-ref";
import {appendColumnMap} from "./from-column-map";
import {FromColumnMapUnion} from "./from-column-map-union";

export type FromJoinArray<ArrT extends readonly IJoin[]> = (
    ArrT[number] extends never ?
    {} :
    FromColumnMapUnion<
        ArrT[number]["columns"]
    >
);
export function appendJoin(
    ref : WritableColumnIdentifierRef,
    join : IJoin
) {
    appendColumnMap(ref, join.columns);
    return ref;
}
export function appendJoinArray(
    ref : WritableColumnIdentifierRef,
    arr : readonly IJoin[]
) {
    for (const join of arr) {
        appendJoin(ref, join);
    }
    return ref;
}
export function fromJoinArray<ArrT extends readonly IJoin[]> (
    arr : ArrT
) : FromJoinArray<ArrT> {
    const result : WritableColumnIdentifierRef = {};
    appendJoinArray(result, arr);
    return result as FromJoinArray<ArrT>;
}

import {IJoin} from "../../../join";
import {FromJoin, fromJoin} from "./from-join";
import { IColumn } from "../../column";

export type FromJoinArray<JoinsT extends readonly IJoin[]> = (
    JoinsT extends readonly IJoin[] ?
    FromJoin<JoinsT[number]> :
    never
);
export function fromJoinArray<
    JoinsT extends readonly IJoin[]
> (
    joins : JoinsT
) : (
    FromJoinArray<JoinsT>[]
) {
    const result : IColumn[] = [];
    for (const join of joins) {
        result.push(...fromJoin(join));
    }
    return result as FromJoinArray<JoinsT>[];
}

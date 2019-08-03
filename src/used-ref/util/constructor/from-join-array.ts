import {IJoin} from "../../../join";
import {FromJoin} from "./from-join";
import {ColumnIdentifierRefUtil} from "../../../column-identifier-ref";

export type FromJoinArray<JoinsT extends readonly IJoin[]> = (
    FromJoin<JoinsT[number]>
);
export function fromJoinArray<
    JoinsT extends readonly IJoin[]
> (
    joins : JoinsT
) : (
    FromJoinArray<JoinsT>
) {
    const result : FromJoinArray<JoinsT> = {
        __contravarianceMarker : () => {},
        columns : ColumnIdentifierRefUtil.fromJoinArray(joins)
    };
    return result as FromJoinArray<JoinsT>;
}

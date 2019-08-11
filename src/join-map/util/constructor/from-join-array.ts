import {IJoin, JoinUtil} from "../../../join";
import {WritableJoinMap} from "../../join-map";

export type FromJoinArray<JoinsT extends readonly IJoin[]> = (
    JoinsT extends readonly IJoin[] ?
    {
        readonly [tableAlias in JoinsT[number]["tableAlias"]] : (
            JoinUtil.ExtractWithTableAlias<
                JoinsT[number],
                tableAlias
            >
        )
    } :
    never
);
export function fromJoinArray<JoinsT extends readonly IJoin[]> (
    joins : JoinsT
) : (
    FromJoinArray<JoinsT>
) {
    const result : WritableJoinMap = {};
    for (const join of joins) {
        result[join.tableAlias] = join;
    }
    return result as FromJoinArray<JoinsT>;
}

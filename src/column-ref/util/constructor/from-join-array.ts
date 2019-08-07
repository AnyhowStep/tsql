import {IJoin, JoinArrayUtil} from "../../../join";
import {ColumnMapUtil} from "../../../column-map";
import {WritableColumnRef} from "../../column-ref";
import {setJoin} from "./from-join";

/**
 * + Assumes `JoinsT` is not a union type
 * + Assumes no duplicate `tableAlias` in `JoinsT`
 */
export type FromJoinArray<JoinsT extends readonly IJoin[]> = (
    {
        readonly [tableAlias in JoinArrayUtil.TableAlias<JoinsT>] : (
            ColumnMapUtil.FromJoin<
                JoinArrayUtil.ExtractWithTableAlias<JoinsT, tableAlias>
            >
        )
    }
);
export function setJoinArray (ref : WritableColumnRef, joins : readonly IJoin[]) {
    for (const join of joins) {
        setJoin(ref, join);
    }
}

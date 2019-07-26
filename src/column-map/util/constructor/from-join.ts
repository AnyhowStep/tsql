import {toNullable, ToNullable} from "../operation";
import {IJoin} from "../../../join";

export type FromJoin<JoinT extends IJoin> = (
    JoinT extends IJoin ?
    (
        true extends JoinT["nullable"] ?
        /**
         * We use nullable columns because when using `LEFT/RIGHT JOIN`s,
         * the columns can become `null`, and we still want to allow joining
         * `null` with `int` columns
         */
        ToNullable<JoinT["columns"]> :
        JoinT["columns"]
    ) :
    never
);
export function fromJoin<JoinT extends IJoin> (
    join : JoinT
) : FromJoin<JoinT> {
    if (join.nullable) {
        return toNullable(join.columns) as FromJoin<JoinT>;
    } else {
        return join.columns as FromJoin<JoinT>;
    }
}

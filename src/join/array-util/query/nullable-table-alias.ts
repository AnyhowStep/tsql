import {IJoin} from "../../join";

export type NullableTableAlias<JoinsT extends readonly IJoin[]> = (
    Extract<
        JoinsT[number],
        { nullable : true }
    >["tableAlias"]
);

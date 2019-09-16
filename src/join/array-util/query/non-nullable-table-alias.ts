import {IJoin} from "../../join";

export type NonNullableTableAlias<JoinsT extends readonly IJoin[]> = (
    Extract<
        JoinsT[number],
        { nullable : false }
    >["tableAlias"]
);

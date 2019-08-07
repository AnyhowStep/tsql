import {IJoin} from "../../join";

export type TableAlias<JoinsT extends readonly IJoin[]> = (
    JoinsT[number]["tableAlias"]
);

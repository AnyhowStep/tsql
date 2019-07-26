import {IJoin} from "../../join";

export type TableAliases<JoinsT extends readonly IJoin[]> = (
    JoinsT[number]["aliasedTable"]["tableAlias"]
);
import {IFromClause} from "../../from-clause";
import {IJoin} from "../../../join";

export type AfterFromClause = (
    IFromClause<{
        parentJoins : (readonly IJoin[])|undefined,
        currentJoins : readonly IJoin[],
    }>
);

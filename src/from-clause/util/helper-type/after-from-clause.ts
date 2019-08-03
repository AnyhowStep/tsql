import {IFromClause} from "../../from-clause";
import {IJoin} from "../../../join";

export type AfterFromClause = (
    IFromClause<{
        outerQueryJoins : (readonly IJoin[])|undefined,
        currentJoins : readonly IJoin[],
    }>
);

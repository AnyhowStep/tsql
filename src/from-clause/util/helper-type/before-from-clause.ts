import {IFromClause} from "../../from-clause";
import {IJoin} from "../../../join";

export type BeforeFromClause = (
    IFromClause<{
        outerQueryJoins : (readonly IJoin[])|undefined,
        currentJoins : undefined,
    }>
);

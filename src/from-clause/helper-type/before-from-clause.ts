import {IFromClause} from "../from-clause";
import {IJoin} from "../../join";

export type BeforeFromClause = (
    IFromClause<{
        parentJoins : (readonly IJoin[])|undefined,
        currentJoins : undefined,
    }>
);

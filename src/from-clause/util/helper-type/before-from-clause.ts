import {IFromClause} from "../../from-clause";
import {IJoin} from "../../../join";

export interface BeforeFromClause extends IFromClause<{
    outerQueryJoins : (readonly IJoin[])|undefined,
    currentJoins : undefined,
}> {

}

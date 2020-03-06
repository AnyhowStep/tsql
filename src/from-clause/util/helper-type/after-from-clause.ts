import {IFromClause} from "../../from-clause";
import {IJoin} from "../../../join";

export interface AfterFromClause extends IFromClause<{
    outerQueryJoins : (readonly IJoin[])|undefined,
    currentJoins : readonly IJoin[],
}> {

}

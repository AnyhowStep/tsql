import {IJoin} from "../join";

export interface FromClauseData {
    readonly parentJoins : (readonly IJoin[])|undefined,
    readonly currentJoins : (readonly IJoin[])|undefined,
}

export interface IFromClause<DataT extends FromClauseData=FromClauseData> {
    readonly parentJoins : DataT["parentJoins"],
    readonly currentJoins : DataT["currentJoins"],
}

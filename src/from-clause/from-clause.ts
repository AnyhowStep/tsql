import {IJoin} from "../join";

export interface FromClauseData {
    readonly outerQueryJoins : (readonly IJoin[])|undefined,
    readonly currentJoins : (readonly IJoin[])|undefined,
}

export interface IFromClause<DataT extends FromClauseData=FromClauseData> {
    readonly outerQueryJoins : DataT["outerQueryJoins"],
    readonly currentJoins : DataT["currentJoins"],
}

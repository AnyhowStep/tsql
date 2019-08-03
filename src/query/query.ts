import {IFromClause} from "../from-clause/from-clause";

export interface QueryData {
    readonly fromClause : IFromClause,
}

export interface IQuery<DataT extends QueryData=QueryData> {
    readonly fromClause : DataT["fromClause"],
}

import {QueryData, IQuery} from "./query";

export class Query<DataT extends QueryData> implements IQuery<DataT> {
    readonly fromClause : DataT["fromClause"];

    constructor (data : DataT) {
        this.fromClause = data.fromClause;
    }
}

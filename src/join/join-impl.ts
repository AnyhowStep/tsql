import {IColumn} from "../column";
import {JoinData, IJoin, JoinType} from "./join";

export class Join<DataT extends JoinData> implements IJoin<DataT> {
    readonly aliasedTable : DataT["aliasedTable"];
    readonly columns : DataT["columns"];
    readonly nullable : DataT["nullable"];

    readonly joinType : JoinType;
    //The from and to columns must have the same length
    readonly from : readonly IColumn[];
    readonly to : readonly IColumn[];

    constructor (
        data : DataT,
        joinType : JoinType,
        from : readonly IColumn[],
        to : readonly IColumn[],
    ) {
        this.aliasedTable = data.aliasedTable;
        this.columns = data.columns;
        this.nullable = data.nullable;

        this.joinType = joinType;
        this.from = from;
        this.to = to;
    }
}
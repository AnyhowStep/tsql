import {IColumn} from "../column";
import {JoinData, IJoin, JoinType} from "./join";

export class Join<DataT extends JoinData> implements IJoin<DataT> {
    readonly tableAlias : DataT["tableAlias"];
    readonly nullable : DataT["nullable"];
    readonly columns : DataT["columns"];

    readonly originalColumns : DataT["originalColumns"];

    readonly primaryKey : DataT["primaryKey"];

    readonly deleteEnabled : DataT["deleteEnabled"];

    readonly mutableColumns : DataT["mutableColumns"];

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
        this.tableAlias = data.tableAlias;
        this.columns = data.columns;
        this.nullable = data.nullable;

        this.originalColumns = data.originalColumns;

        this.primaryKey = data.primaryKey;

        this.deleteEnabled = data.deleteEnabled;

        this.mutableColumns = data.mutableColumns;

        this.joinType = joinType;
        this.from = from;
        this.to = to;
    }
}

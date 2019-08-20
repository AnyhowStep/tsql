import {JoinData, IJoin, JoinType} from "./join";
import {OnClause} from "../on-clause";

export class Join<DataT extends JoinData> implements IJoin<DataT> {
    readonly tableAlias : DataT["tableAlias"];
    readonly nullable : DataT["nullable"];
    readonly columns : DataT["columns"];

    readonly originalColumns : DataT["originalColumns"];

    readonly primaryKey : DataT["primaryKey"];

    readonly candidateKeys : DataT["candidateKeys"];

    readonly deleteEnabled : DataT["deleteEnabled"];

    readonly mutableColumns : DataT["mutableColumns"];

    readonly joinType : JoinType;
    readonly onClause : OnClause|undefined;

    constructor (
        data : DataT,
        joinType : JoinType,
        onClause : OnClause|undefined
    ) {
        this.tableAlias = data.tableAlias;
        this.columns = data.columns;
        this.nullable = data.nullable;

        this.originalColumns = data.originalColumns;

        this.primaryKey = data.primaryKey;

        this.candidateKeys = data.candidateKeys;

        this.deleteEnabled = data.deleteEnabled;

        this.mutableColumns = data.mutableColumns;

        this.joinType = joinType;
        this.onClause = onClause;
    }
}

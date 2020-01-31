import {ColumnData, IColumn} from "../column";

export interface ExprColumnData extends ColumnData {
    readonly isAggregate : boolean;
}
export interface IExprColumn<DataT extends ExprColumnData=ExprColumnData> extends IColumn<DataT> {
    readonly isAggregate : DataT["isAggregate"];
}

import {ITable} from "../table";
import {QueryBaseUtil} from "../query-base";
import {ColumnRefUtil} from "../column-ref";
import {InsertSelectRow} from "./insert-select-row";

export type InsertSelectDelegateColumns<
    QueryT extends QueryBaseUtil.AfterSelectClause
> =
    ColumnRefUtil.TryFlatten<
        ColumnRefUtil.FromSelectClause<QueryT["selectClause"]>
    >
;
export type InsertSelectDelegate<
    QueryT extends QueryBaseUtil.AfterSelectClause,
    TableT extends ITable
> =
    (
        columns : InsertSelectDelegateColumns<QueryT>
    ) => InsertSelectRow<QueryT, TableT>
;

import {QueryBaseUtil} from "../../../query-base";
import {ITable} from "../../../table";
import {InsertSelectDelegate} from "../../insert-select-delegate";
import {InsertSelectRow} from "../../insert-select-row";
import {ColumnRefUtil} from "../../../column-ref";
import {cleanInsertSelectRow} from "../operation";

export function insertSelect<
    QueryT extends QueryBaseUtil.AfterSelectClause,
    TableT extends ITable
> (
    query : QueryT,
    table : TableT,
    delegate : InsertSelectDelegate<QueryT, TableT>
) : InsertSelectRow<QueryT, TableT> {
    const columns = ColumnRefUtil.tryFlatten(
        ColumnRefUtil.fromSelectClause<QueryT["selectClause"]>(
            query.selectClause
        )
    );
    const row = delegate(columns);
    return cleanInsertSelectRow(query, table, row);
}

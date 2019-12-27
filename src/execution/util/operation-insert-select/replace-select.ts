import {QueryBaseUtil} from "../../../query-base";
import {InsertableTable, TableUtil, DeletableTable} from "../../../table";
import {InsertSelectDelegate, InsertSelectUtil} from "../../../insert-select";
import {ReplaceManyResult, ReplaceSelectConnection} from "../../connection";

export async function replaceSelect<
    QueryT extends QueryBaseUtil.AfterSelectClause & QueryBaseUtil.NonCorrelated,
    TableT extends InsertableTable & DeletableTable
> (
    connection : ReplaceSelectConnection,
    query : QueryT,
    table : TableT,
    rowDelegate : InsertSelectDelegate<QueryT, TableT>
) : Promise<ReplaceManyResult> {
    TableUtil.assertInsertEnabled(table);
    TableUtil.assertDeleteEnabled(table);

    const row = InsertSelectUtil.insertSelect(query, table, rowDelegate);
    return connection.replaceSelect(
        query,
        table,
        row
    );
}

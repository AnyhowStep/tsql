import {QueryBaseUtil} from "../../../query-base";
import {InsertableTable, TableUtil} from "../../../table";
import {InsertSelectDelegate, InsertSelectUtil} from "../../../insert-select";
import {InsertIgnoreManyResult, InsertIgnoreSelectConnection} from "../../connection";

export async function insertIgnoreSelect<
    QueryT extends QueryBaseUtil.AfterSelectClause & QueryBaseUtil.NonCorrelated,
    TableT extends InsertableTable
> (
    connection : InsertIgnoreSelectConnection,
    query : QueryT,
    table : TableT,
    rowDelegate : InsertSelectDelegate<QueryT, TableT>
) : Promise<InsertIgnoreManyResult> {
    TableUtil.assertInsertEnabled(table);

    const row = InsertSelectUtil.insertSelect(query, table, rowDelegate);
    return connection.insertIgnoreSelect(
        query,
        table,
        row
    );
}

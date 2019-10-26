import {QueryBaseUtil} from "../../../query-base";
import {InsertableTable, TableUtil} from "../../../table";
import {InsertSelectDelegate, InsertSelectUtil} from "../../../insert-select";
import {InsertSelectConnection, InsertManyResult} from "../../connection";

export async function insertSelect<
    QueryT extends QueryBaseUtil.AfterSelectClause,
    TableT extends InsertableTable
> (
    connection : InsertSelectConnection,
    query : QueryT,
    table : TableT,
    rowDelegate : InsertSelectDelegate<QueryT, TableT>
) : Promise<InsertManyResult> {
    TableUtil.assertInsertEnabled(table);

    const row = InsertSelectUtil.insertSelect(query, table, rowDelegate);
    return connection.insertSelect(
        query,
        table,
        row
    );
}

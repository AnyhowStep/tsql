import {QueryBaseUtil} from "../../../query-base";
import {InsertableTable, TableUtil} from "../../../table";
import {InsertSelectDelegate, InsertSelectUtil} from "../../../insert-select";
import {InsertSelectConnection, InsertManyResult} from "../../connection";
import {InsertSelectEvent} from "../../../event";

export async function insertSelect<
    QueryT extends QueryBaseUtil.AfterSelectClause & QueryBaseUtil.NonCorrelated,
    TableT extends InsertableTable
> (
    connection : InsertSelectConnection,
    query : QueryT,
    table : TableT,
    rowDelegate : InsertSelectDelegate<QueryT, TableT>
) : Promise<InsertManyResult> {
    TableUtil.assertInsertEnabled(table);

    return connection.lock(async (connection) : Promise<InsertManyResult> => {
        const insertSelectRow = InsertSelectUtil.insertSelect(query, table, rowDelegate);
        const insertResult = await connection.insertSelect(
            query,
            table,
            insertSelectRow
        );

        const fullConnection = connection.tryGetFullConnection();
        if (fullConnection != undefined) {
            await fullConnection.eventEmitters.onInsertSelect.invoke(new InsertSelectEvent({
                connection : fullConnection,
                query,
                table,
                insertSelectRow,
                insertResult,
            }));
        }

        return insertResult;
    });
}

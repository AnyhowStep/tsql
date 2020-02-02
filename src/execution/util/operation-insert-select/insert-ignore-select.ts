import {QueryBaseUtil} from "../../../query-base";
import {InsertableTable, TableUtil} from "../../../table";
import {InsertSelectDelegate, InsertSelectUtil} from "../../../insert-select";
import {InsertIgnoreManyResult, InsertIgnoreSelectConnection} from "../../connection";
import {InsertSelectEvent} from "../../../event";

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

    return connection.lock(async (connection) : Promise<InsertIgnoreManyResult> => {
        const insertSelectRow = InsertSelectUtil.insertSelect(query, table, rowDelegate);
        const insertResult = await connection.insertIgnoreSelect(
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

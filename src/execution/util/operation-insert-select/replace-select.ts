import {QueryBaseUtil} from "../../../query-base";
import {InsertableTable, TableUtil, DeletableTable} from "../../../table";
import {InsertSelectDelegate, InsertSelectUtil} from "../../../insert-select";
import {ReplaceManyResult, ReplaceSelectConnection} from "../../connection";
import {ReplaceSelectEvent} from "../../../event";

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

    return connection.lock(async (connection) : Promise<ReplaceManyResult> => {
        const replaceSelectRow = InsertSelectUtil.insertSelect(query, table, rowDelegate);
        const replaceResult = await connection.replaceSelect(
            query,
            table,
            replaceSelectRow
        );

        const fullConnection = connection.tryGetFullConnection();
        if (fullConnection != undefined) {
            await fullConnection.eventEmitters.onReplaceSelect.invoke(new ReplaceSelectEvent({
                connection : fullConnection,
                query,
                table,
                replaceSelectRow,
                replaceResult,
            }));
        }

        return replaceResult;
    });
}

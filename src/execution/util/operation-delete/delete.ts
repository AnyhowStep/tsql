import {DeletableTable, TableUtil} from "../../../table";
import {WhereDelegate, WhereClauseUtil} from "../../../where-clause";
import {FromClauseUtil} from "../../../from-clause";
import {DeleteResult, DeleteConnection} from "../../connection";
import {DeleteEvent} from "../../../event";

async function del<
    TableT extends DeletableTable
> (
    table : TableT,
    connection : DeleteConnection,
    whereDelegate : WhereDelegate<
        FromClauseUtil.From<
            FromClauseUtil.NewInstance,
            TableT
        >
    >
) : Promise<DeleteResult> {
    TableUtil.assertDeleteEnabled(table);

    const whereClause = WhereClauseUtil.where(
        FromClauseUtil.from<
            FromClauseUtil.NewInstance,
            TableT
        >(
            FromClauseUtil.newInstance(),
            table as (
                & TableT
                & FromClauseUtil.AssertValidCurrentJoinBase<
                    FromClauseUtil.NewInstance,
                    TableT
                >
            )
        ),
        undefined,
        whereDelegate
    );
    return connection.lock(async (connection) : Promise<DeleteResult> => {
        const deleteResult = await connection.delete(table, whereClause);

        const fullConnection = connection.tryGetFullConnection();
        if (fullConnection != undefined) {
            await fullConnection.eventEmitters.onDelete.invoke(new DeleteEvent({
                connection : fullConnection,
                table,
                whereClause,
                deleteResult,
            }));
        }

        return deleteResult;
    });
}
export {
    del as delete,
};

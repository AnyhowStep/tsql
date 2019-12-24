import {ITable} from "../../../table";
import {WhereDelegate, WhereClauseUtil} from "../../../where-clause";
import {FromClauseUtil} from "../../../from-clause";
import {UpdateConnection, UpdateResult} from "../../connection";
import {AssignmentMapDelegate, UpdateUtil} from "../../../update";
import {UpdateEvent} from "../../../event";

export async function update<
    TableT extends ITable
> (
    table : TableT,
    connection : UpdateConnection,
    whereDelegate : WhereDelegate<
        FromClauseUtil.From<
            FromClauseUtil.NewInstance,
            TableT
        >
    >,
    assignmentMapDelegate : AssignmentMapDelegate<TableT>
) : Promise<UpdateResult> {
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
    const assignmentMap = UpdateUtil.set(table, assignmentMapDelegate);

    return connection.lock(async (connection) : Promise<UpdateResult> => {
        const updateResult = await connection.update(table, whereClause, assignmentMap);

        const fullConnection = connection.tryGetFullConnection();
        if (fullConnection != undefined) {
            await fullConnection.eventEmitters.onUpdate.invoke(new UpdateEvent({
                connection : fullConnection,
                table,
                whereClause,
                assignmentMap,
                updateResult,
            }));
        }

        return updateResult;
    });
}

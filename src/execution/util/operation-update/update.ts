import * as tm from "type-mapping";
import {ITable} from "../../../table";
import {WhereDelegate, WhereClauseUtil, WhereClause} from "../../../where-clause";
import {FromClauseUtil} from "../../../from-clause";
import {UpdateConnection, UpdateResult} from "../../connection";
import {AssignmentMapDelegate, UpdateUtil, BuiltInAssignmentMap} from "../../../update";
import {UpdateEvent} from "../../../event";

export async function updateImplNoEvent<
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
) : (
    Promise<{
        whereClause : WhereClause,
        assignmentMap : BuiltInAssignmentMap<TableT>,
        updateResult : UpdateResult,
    }>
) {
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
    const updateResult = await connection.update(table, whereClause, assignmentMap);

    return {
        whereClause,
        assignmentMap,
        updateResult,
    };
}

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
    return connection.lock(async (connection) : Promise<UpdateResult> => {
        const {
            whereClause,
            assignmentMap,
            updateResult,
        } = await updateImplNoEvent(table, connection, whereDelegate, assignmentMapDelegate);

        if (!tm.BigIntUtil.equal(updateResult.updatedRowCount, tm.BigInt(0))) {
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
        }

        return updateResult;
    });
}

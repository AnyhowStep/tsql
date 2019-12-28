import * as tm from "type-mapping";
import {DeletableTable, TableUtil} from "../../../table";
import {WhereDelegate, WhereClauseUtil, WhereClause} from "../../../where-clause";
import {FromClauseUtil} from "../../../from-clause";
import {DeleteResult, DeleteConnection} from "../../connection";
import {DeleteEvent} from "../../../event";

export async function deleteImplNoEvent <
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
) : (
    Promise<{
        whereClause : WhereClause,
        deleteResult : DeleteResult,
    }>
) {
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
    const deleteResult = await connection.delete(table, whereClause);

    return {
        whereClause,
        deleteResult,
    };
}

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
    return connection.lock(async (connection) : Promise<DeleteResult> => {
        const {
            whereClause,
            deleteResult,
        } = await deleteImplNoEvent(
            table,
            connection,
            whereDelegate
        );

        if (tm.BigIntUtil.greaterThan(deleteResult.deletedRowCount, tm.BigInt(0))) {
            const fullConnection = connection.tryGetFullConnection();
            if (fullConnection != undefined) {
                await fullConnection.eventEmitters.onDelete.invoke(new DeleteEvent({
                    connection : fullConnection,
                    table,
                    whereClause,
                    deleteResult,
                }));
            }
        }

        return deleteResult;
    });
}
export {
    del as delete,
};

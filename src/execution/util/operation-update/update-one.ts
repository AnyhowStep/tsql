import * as tm from "type-mapping";
import {ITable} from "../../../table";
import {WhereDelegate, WhereClause} from "../../../where-clause";
import {FromClauseUtil} from "../../../from-clause";
import {IsolableUpdateConnection} from "../../connection";
import * as impl from "./update";
import {RowNotFoundError, TooManyRowsFoundError} from "../../../error";
import {AssignmentMapDelegate, BuiltInAssignmentMap, CustomAssignmentMap} from "../../../update";
import {UpdateEvent} from "../../../event";
import {IsolationLevel} from "../../../isolation-level";

export interface UpdateOneResult {
    query : { sql : string },

    //Alias for affectedRows
    foundRowCount : 1n;

    //Alias for changedRows
    updatedRowCount : 0n|1n;

    /**
     * May be the duplicate row count, or some other value.
     */
    warningCount : bigint;
    /**
     * An arbitrary message.
     * May be an empty string.
     */
    message : string;
}

export async function updateOneImplNoEvent<
    TableT extends ITable,
    AssignmentMapT extends CustomAssignmentMap<TableT>
> (
    table : TableT,
    connection : IsolableUpdateConnection,
    whereDelegate : WhereDelegate<
        FromClauseUtil.From<
            FromClauseUtil.NewInstance,
            TableT
        >
    >,
    assignmentMapDelegate : AssignmentMapDelegate<TableT, AssignmentMapT>
) : Promise<{
    whereClause : WhereClause,
    assignmentMap : BuiltInAssignmentMap<TableT>,
    updateResult : UpdateOneResult,
}> {
    /**
     * `READ_UNCOMMITTED` because this should be a simple `UPDATE` statement.
     * It should execute no other statements.
     */
    return connection.transactionIfNotInOne(IsolationLevel.READ_UNCOMMITTED, async (connection) : Promise<{
        whereClause : WhereClause,
        assignmentMap : BuiltInAssignmentMap<TableT>,
        updateResult : UpdateOneResult,
    }> => {
        return connection.savepoint(async (connection) : Promise<{
            whereClause : WhereClause,
            assignmentMap : BuiltInAssignmentMap<TableT>,
            updateResult : UpdateOneResult,
        }> => {
            const {
                whereClause,
                assignmentMap,
                updateResult,
            } = await impl.updateImplNoEvent<TableT, AssignmentMapT>(
                table,
                connection,
                whereDelegate,
                assignmentMapDelegate
            );
            if (tm.BigIntUtil.equal(updateResult.foundRowCount, tm.BigInt(0))) {
                throw new RowNotFoundError(
                    `Expected to find one row of ${table.alias}; found ${updateResult.foundRowCount} rows`,
                    updateResult.query.sql
                );
            }
            if (tm.BigIntUtil.equal(updateResult.foundRowCount, tm.BigInt(1))) {
                if (
                    tm.BigIntUtil.equal(updateResult.updatedRowCount, tm.BigInt(0)) ||
                    tm.BigIntUtil.equal(updateResult.updatedRowCount, tm.BigInt(1))
                ) {
                    return {
                        whereClause,
                        assignmentMap,
                        updateResult : updateResult as UpdateOneResult,
                    };
                } else {
                    //Should never happen...
                    throw new Error(`Expected to update zero or one row of ${table.alias}; updated ${updateResult.updatedRowCount}`);
                }
            }
            throw new TooManyRowsFoundError(
                `Expected to find one row of ${table.alias}; found ${updateResult.foundRowCount} rows`,
                updateResult.query.sql
            );
        });
    });
}

export async function updateOne<
    TableT extends ITable,
    AssignmentMapT extends CustomAssignmentMap<TableT>
> (
    table : TableT,
    connection : IsolableUpdateConnection,
    whereDelegate : WhereDelegate<
        FromClauseUtil.From<
            FromClauseUtil.NewInstance,
            TableT
        >
    >,
    assignmentMapDelegate : AssignmentMapDelegate<TableT, AssignmentMapT>
) : Promise<UpdateOneResult> {
    return connection.lock(async (connection) : Promise<UpdateOneResult> => {
        const {
            whereClause,
            assignmentMap,
            updateResult,
        } = await updateOneImplNoEvent<TableT, AssignmentMapT>(table, connection, whereDelegate, assignmentMapDelegate);

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

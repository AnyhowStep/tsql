import * as tm from "type-mapping";
import {ITable} from "../../../table";
import {WhereDelegate, WhereClause} from "../../../where-clause";
import {FromClauseUtil} from "../../../from-clause";
import {IsolableUpdateConnection} from "../../connection";
import * as impl from "./update";
import {TooManyRowsFoundError} from "../../../error";
import {AssignmentMapDelegate, BuiltInAssignmentMap} from "../../../update";
import {UpdateOneResult} from "./update-one";
import {UpdateEvent} from "../../../event";

export interface NotFoundUpdateResult {
    query : { sql : string },

    //Alias for affectedRows
    foundRowCount : 0n;

    //Alias for changedRows
    updatedRowCount : 0n;

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
export type UpdateZeroOrOneResult =
    | NotFoundUpdateResult
    | UpdateOneResult
;

export async function updateZeroOrOneImplNoEvent<
    TableT extends ITable
> (
    table : TableT,
    connection : IsolableUpdateConnection,
    whereDelegate : WhereDelegate<
        FromClauseUtil.From<
            FromClauseUtil.NewInstance,
            TableT
        >
    >,
    assignmentMapDelegate : AssignmentMapDelegate<TableT>
) : Promise<{
    whereClause : WhereClause,
    assignmentMap : BuiltInAssignmentMap<TableT>,
    updateResult : UpdateZeroOrOneResult,
}> {
    return connection.transactionIfNotInOne(async (connection) : Promise<{
        whereClause : WhereClause,
        assignmentMap : BuiltInAssignmentMap<TableT>,
        updateResult : UpdateZeroOrOneResult,
    }> => {
        const {
            whereClause,
            assignmentMap,
            updateResult,
        } = await impl.updateImplNoEvent(
            table,
            connection,
            whereDelegate,
            assignmentMapDelegate
        );
        if (tm.BigIntUtil.equal(updateResult.foundRowCount, tm.BigInt(0))) {
            if (tm.BigIntUtil.equal(updateResult.updatedRowCount, tm.BigInt(0))) {
                return {
                    whereClause,
                    assignmentMap,
                    updateResult : updateResult as NotFoundUpdateResult,
                };
            } else {
                //Should never happen...
                throw new Error(`Expected to update zero rows of ${table.alias}; updated ${updateResult.updatedRowCount}`);
            }
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
}

export async function updateZeroOrOne<
    TableT extends ITable
> (
    table : TableT,
    connection : IsolableUpdateConnection,
    whereDelegate : WhereDelegate<
        FromClauseUtil.From<
            FromClauseUtil.NewInstance,
            TableT
        >
    >,
    assignmentMapDelegate : AssignmentMapDelegate<TableT>
) : Promise<UpdateZeroOrOneResult> {
    return connection.lock(async (connection) : Promise<UpdateZeroOrOneResult> => {
        const {
            whereClause,
            assignmentMap,
            updateResult,
        } = await updateZeroOrOneImplNoEvent(
            table,
            connection,
            whereDelegate,
            assignmentMapDelegate
        );

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

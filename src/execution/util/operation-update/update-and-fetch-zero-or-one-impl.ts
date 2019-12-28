import * as tm from "type-mapping";
import {ITable, TableUtil} from "../../../table";
import {IsolableUpdateConnection, UpdateConnection, IsolatedConnection} from "../../connection";
import {CustomAssignmentMap, BuiltInAssignmentMap} from "../../../update";
import {UpdateOneResult} from "./update-one";
import {UpdateAndFetchEvent, UpdateEvent} from "../../../event";
import {WhereDelegate, WhereClause} from "../../../where-clause";
import {FromClauseUtil} from "../../../from-clause";
import {NotFoundUpdateResult, updateZeroOrOneImplNoEvent} from "./update-zero-or-one";
import {UpdateAndFetchOneResult} from "./update-and-fetch-one-impl";
import {Identity} from "../../../type-util";
import {RowNotFoundError} from "../../../error";

export interface NotFoundUpdateAndFetchResult extends NotFoundUpdateResult {
    row : undefined,
}

export type UpdateAndFetchZeroOrOneResult<
    TableT extends ITable,
    AssignmentMapT extends CustomAssignmentMap<TableT>
> =
    Identity<
        | NotFoundUpdateAndFetchResult
        | UpdateAndFetchOneResult<TableT, AssignmentMapT>
    >
;

/**
 * This should not be called directly by users.
 *
 * A lot can go wrong here...
 */
export async function updateAndFetchZeroOrOneImpl<
    TableT extends ITable,
    /**
     * This is `updateAndFetchZeroOrOneImpl()` because we only accept `BuiltInAssignmentMap`.
     * We do not accept `CustomAssignmentMap`.
     */
    AssignmentMapT extends BuiltInAssignmentMap<TableT>
> (
    table : TableT,
    connection : IsolableUpdateConnection,
    initCallback : (connection : UpdateConnection & IsolatedConnection<UpdateConnection>) => Promise<
        | {
            success : false,
            rowNotFoundError : RowNotFoundError
        }
        | {
            success : true,
            /**
             * We need two separate `WHERE` clauses because
             * the `UPDATE` statement may change the unique identifier
             * of the row.
             */
            updateWhereDelegate : WhereDelegate<
                FromClauseUtil.From<
                    FromClauseUtil.NewInstance,
                    TableT
                >
            >,
            fetchWhereDelegate : WhereDelegate<
                FromClauseUtil.From<
                    FromClauseUtil.NewInstance,
                    TableT
                >
            >,
            assignmentMap : AssignmentMapT
        }
    >
) : Promise<UpdateAndFetchZeroOrOneResult<TableT, AssignmentMapT>> {
    return connection.lock(async (connection) : Promise<UpdateAndFetchZeroOrOneResult<TableT, AssignmentMapT>> => {
        const updateAndFetchResult = await connection.transactionIfNotInOne(async (connection) : Promise<
            | {
                success : false,
                updateResult : NotFoundUpdateAndFetchResult,
            }
            | {
                success : true,
                updateWhereClause : WhereClause,
                updateResult : UpdateAndFetchZeroOrOneResult<TableT, AssignmentMapT>,
                assignmentMap : AssignmentMapT,
            }
        > => {
            const initResult = await initCallback(connection);

            if (!initResult.success) {
                return {
                    success : false,
                    updateResult : {
                        query : {
                            sql : initResult.rowNotFoundError.sql,
                        },

                        //Alias for affectedRows
                        foundRowCount : tm.BigInt(0) as 0n,

                        //Alias for changedRows
                        updatedRowCount : tm.BigInt(0) as 0n,

                        /**
                         * May be the duplicate row count, or some other value.
                         */
                        warningCount : tm.BigInt(0),
                        /**
                         * An arbitrary message.
                         * May be an empty string.
                         */
                        message : "",

                        row : undefined,
                    },
                };
            }

            const {
                updateWhereDelegate,
                fetchWhereDelegate,
                assignmentMap,
            } = initResult;

            const {
                whereClause : updateWhereClause,
                updateResult : updateZeroOrOneResult,
            } = await updateZeroOrOneImplNoEvent(
                table,
                connection,
                updateWhereDelegate,
                () => assignmentMap
            );

            if (tm.BigIntUtil.equal(updateZeroOrOneResult.foundRowCount, tm.BigInt(0))) {
                const notFoundUpdateResult = updateZeroOrOneResult as NotFoundUpdateResult;
                return {
                    success : true,
                    updateWhereClause,
                    updateResult : {
                        ...notFoundUpdateResult,
                        row : undefined,
                    },
                    assignmentMap,
                };
            } else {
                const updateOneResult = updateZeroOrOneResult as UpdateOneResult;
                const row = await TableUtil.__fetchOneHelper(
                    table,
                    connection,
                    fetchWhereDelegate
                );

                return {
                    success : true,
                    updateWhereClause,
                    updateResult : {
                        ...updateOneResult,
                        row,
                    },
                    assignmentMap,
                };
            }
        });

        if (!updateAndFetchResult.success) {
            return updateAndFetchResult.updateResult;
        }

        const {
            updateWhereClause,
            updateResult,
            assignmentMap,
        } = updateAndFetchResult;

        if (!tm.BigIntUtil.equal(updateResult.updatedRowCount, tm.BigInt(0))) {
            const fullConnection = connection.tryGetFullConnection();
            if (fullConnection != undefined) {
                await fullConnection.eventEmitters.onUpdate.invoke(new UpdateEvent({
                    connection : fullConnection,
                    table,
                    whereClause : updateWhereClause,
                    assignmentMap,
                    updateResult,
                }));
                await fullConnection.eventEmitters.onUpdateAndFetch.invoke(new UpdateAndFetchEvent({
                    connection : fullConnection,
                    table,
                    assignmentMap,
                    updateResult : updateResult as any,
                }));
            }
        }

        return updateResult;
    });
}

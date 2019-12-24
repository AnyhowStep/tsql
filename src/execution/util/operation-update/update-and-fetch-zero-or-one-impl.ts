import * as tm from "type-mapping";
import {ITable, TableUtil} from "../../../table";
import {IsolableUpdateConnection} from "../../connection";
import {CustomAssignmentMap, BuiltInAssignmentMap} from "../../../update";
import {UpdateOneResult} from "./update-one";
import {UpdateAndFetchEvent} from "../../../event";
import {WhereDelegate} from "../../../where-clause";
import {FromClauseUtil} from "../../../from-clause";
import {NotFoundUpdateResult, updateZeroOrOne} from "./update-zero-or-one";
import {UpdateAndFetchOneResult} from "./update-and-fetch-one-impl";
import {Identity} from "../../../type-util";

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
) : Promise<UpdateAndFetchZeroOrOneResult<TableT, AssignmentMapT>> {
    return connection.transactionIfNotInOne(async (connection) : Promise<UpdateAndFetchZeroOrOneResult<TableT, AssignmentMapT>> => {
        const updateZeroOrOneResult = await updateZeroOrOne(
            table,
            connection,
            updateWhereDelegate,
            () => assignmentMap
        );

        if (tm.BigIntUtil.equal(updateZeroOrOneResult.foundRowCount, tm.BigInt(0))) {
            const notFoundUpdateResult = updateZeroOrOneResult as NotFoundUpdateResult;
            return {
                ...notFoundUpdateResult,
                row : undefined,
            };
        } else {
            const updateOneResult = updateZeroOrOneResult as UpdateOneResult;
            const row = await TableUtil.__fetchOneHelper(
                table,
                connection,
                fetchWhereDelegate
            );

            const fullConnection = connection.tryGetFullConnection();
            if (fullConnection != undefined) {
                await fullConnection.eventEmitters.onUpdateAndFetch.invoke(new UpdateAndFetchEvent({
                    connection : fullConnection,
                    table,
                    assignmentMap,
                    updateResult : {
                        ...updateOneResult,
                        row,
                    },
                }));
            }

            return {
                ...updateOneResult,
                row,
            };
        }
    });
}

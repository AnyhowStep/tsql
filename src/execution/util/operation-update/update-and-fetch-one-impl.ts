import {ITable, TableUtil} from "../../../table";
import {IsolableUpdateConnection, UpdateConnection, IsolatedConnection} from "../../connection";
import {CustomAssignmentMap, BuiltInAssignmentMap} from "../../../update";
import {Identity} from "../../../type-util";
import {UpdateOneResult, updateOneImplNoEvent} from "./update-one";
import {CustomExprUtil} from "../../../custom-expr";
import {UpdateAndFetchEvent, UpdateEvent} from "../../../event";
import {WhereDelegate, WhereClause} from "../../../where-clause";
import {FromClauseUtil} from "../../../from-clause";

export type UpdatedAndFetchedRow<
    TableT extends ITable,
    AssignmentMapT extends CustomAssignmentMap<TableT>
> =
    Identity<{
        readonly [columnAlias in TableUtil.ColumnAlias<TableT>] : (
            columnAlias extends keyof AssignmentMapT ?
            (
                undefined extends AssignmentMapT[columnAlias] ?
                TableUtil.ColumnType<TableT, columnAlias> :
                CustomExprUtil.TypeOf<
                    AssignmentMapT[columnAlias]
                >
            ) :
            TableUtil.ColumnType<TableT, columnAlias>
        )
    }>
;

export type UpdateAndFetchOneResult<
    TableT extends ITable,
    AssignmentMapT extends CustomAssignmentMap<TableT>
> =
    Identity<
        & UpdateOneResult
        & {
            row : UpdatedAndFetchedRow<TableT, AssignmentMapT>,
        }
    >
;

/**
 * This should not be called directly by users.
 *
 * A lot can go wrong here...
 */
export async function updateAndFetchOneImpl<
    TableT extends ITable,
    /**
     * This is `updateAndFetchOneImpl()` because we only accept `BuiltInAssignmentMap`.
     * We do not accept `CustomAssignmentMap`.
     */
    AssignmentMapT extends BuiltInAssignmentMap<TableT>
> (
    table : TableT,
    connection : IsolableUpdateConnection,
    initCallback : (connection : UpdateConnection & IsolatedConnection<UpdateConnection>) => Promise<{
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
    }>
) : Promise<UpdateAndFetchOneResult<TableT, AssignmentMapT>> {
    return connection.lock(async (connection) : Promise<UpdateAndFetchOneResult<TableT, AssignmentMapT>> => {
        const {
            updateWhereClause,
            updateResult,
            assignmentMap,
        } = await connection.transactionIfNotInOne(async (connection) : Promise<{
            updateWhereClause : WhereClause,
            updateResult : UpdateAndFetchOneResult<TableT, AssignmentMapT>,
            assignmentMap : AssignmentMapT,
        }> => {
            const {
                updateWhereDelegate,
                fetchWhereDelegate,
                assignmentMap,
            } = await initCallback(connection);
            const {
                whereClause : updateWhereClause,
                updateResult : updateOneResult,
            } = await updateOneImplNoEvent(
                table,
                connection,
                updateWhereDelegate,
                () => assignmentMap
            );
            const row = await TableUtil.__fetchOneHelper(
                table,
                connection,
                fetchWhereDelegate
            );

            return {
                updateWhereClause,
                updateResult : {
                    ...updateOneResult,
                    row,
                },
                assignmentMap,
            };
        });

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

        return updateResult;
    });
}

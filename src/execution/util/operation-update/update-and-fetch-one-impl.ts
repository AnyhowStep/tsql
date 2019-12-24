import {ITable, TableUtil} from "../../../table";
import {IsolableUpdateConnection} from "../../connection";
import {CustomAssignmentMap, BuiltInAssignmentMap} from "../../../update";
import {Identity} from "../../../type-util";
import {UpdateOneResult, updateOne} from "./update-one";
import {CustomExprUtil} from "../../../custom-expr";
import {UpdateAndFetchEvent} from "../../../event";
import {WhereDelegate} from "../../../where-clause";
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
) : Promise<UpdateAndFetchOneResult<TableT, AssignmentMapT>> {
    return connection.transactionIfNotInOne(async (connection) : Promise<UpdateAndFetchOneResult<TableT, AssignmentMapT>> => {
        const updateOneResult = await updateOne(
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
    });
}

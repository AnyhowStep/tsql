import * as tm from "type-mapping";
import {DeletableTable, TableUtil} from "../../../table";
import {WhereDelegate, WhereClause} from "../../../where-clause";
import {FromClauseUtil} from "../../../from-clause";
import {IsolableDeleteConnection} from "../../connection";
import * as impl from "./delete";
import {RowNotFoundError, TooManyRowsFoundError} from "../../../error";
import {DeleteEvent} from "../../../event";
import {IsolationLevel} from "../../../isolation-level";

export interface DeleteOneResult {
    query : { sql : string },

    //Alias for affectedRows
    deletedRowCount : 1n;

    /**
     * @todo MySQL sometimes gives a `warningCount` value `> 0` for
     * `DELETE` statements. Recall why.
     */
    warningCount : bigint;
    /**
     * An arbitrary message.
     * May be an empty string.
     */
    message : string;
}
export async function deleteOne<
    TableT extends DeletableTable
> (
    table : TableT,
    connection : IsolableDeleteConnection,
    whereDelegate : WhereDelegate<
        FromClauseUtil.From<
            FromClauseUtil.NewInstance,
            TableT
        >
    >
) : Promise<DeleteOneResult> {
    TableUtil.assertDeleteEnabled(table);

    return connection.lock(async (connection) : Promise<DeleteOneResult> => {
        /**
         * `READ_UNCOMMITTED` because this should be a simple `DELETE` statement.
         * It should execute no other statements.
         */
        const {
            whereClause,
            deleteResult,
        } = await connection.transactionIfNotInOne(IsolationLevel.READ_UNCOMMITTED, async (connection) : Promise<{
            whereClause : WhereClause,
            deleteResult : DeleteOneResult
        }> => {
            const {
                whereClause,
                deleteResult,
            } = await impl.deleteImplNoEvent(
                table,
                connection,
                whereDelegate
            );
            if (tm.BigIntUtil.equal(deleteResult.deletedRowCount, tm.BigInt(0))) {
                throw new RowNotFoundError(
                    `Expected to delete one row of ${table.alias}; found ${deleteResult.deletedRowCount} rows`,
                    deleteResult.query.sql
                );
            }
            if (tm.BigIntUtil.equal(deleteResult.deletedRowCount, tm.BigInt(1))) {
                return {
                    whereClause,
                    deleteResult : deleteResult as DeleteOneResult,
                };
            }
            throw new TooManyRowsFoundError(
                `Expected to delete one row of ${table.alias}; found ${deleteResult.deletedRowCount} rows`,
                deleteResult.query.sql
            );
        });

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

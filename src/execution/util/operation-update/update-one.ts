import * as tm from "type-mapping";
import {ITable} from "../../../table";
import {WhereDelegate} from "../../../where-clause";
import {FromClauseUtil} from "../../../from-clause";
import {IsolableUpdateConnection} from "../../connection";
import * as impl from "./update";
import {RowNotFoundError, TooManyRowsFoundError} from "../../../error";
import {AssignmentMapDelegate} from "../../../update";

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
export async function updateOne<
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
) : Promise<UpdateOneResult> {
    return connection.transactionIfNotInOne(async (connection) : Promise<UpdateOneResult> => {
        const result = await impl.update(
            table,
            connection,
            whereDelegate,
            assignmentMapDelegate
        );
        if (tm.BigIntUtil.equal(result.foundRowCount, tm.BigInt(0))) {
            throw new RowNotFoundError(
                `Expected to find one row of ${table.alias}; found ${result.foundRowCount} rows`,
                result.query.sql
            );
        }
        if (tm.BigIntUtil.equal(result.foundRowCount, tm.BigInt(1))) {
            if (
                tm.BigIntUtil.equal(result.updatedRowCount, tm.BigInt(0)) ||
                tm.BigIntUtil.equal(result.updatedRowCount, tm.BigInt(1))
            ) {
                return result as UpdateOneResult;
            } else {
                //Should never happen...
                throw new Error(`Expected to update zero or one row of ${table.alias}; updated ${result.updatedRowCount}`);
            }
        }
        throw new TooManyRowsFoundError(
            `Expected to find one row of ${table.alias}; found ${result.foundRowCount} rows`,
            result.query.sql
        );
    });
}

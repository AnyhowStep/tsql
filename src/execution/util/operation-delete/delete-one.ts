import * as tm from "type-mapping";
import {DeletableTable, TableUtil} from "../../../table";
import {WhereDelegate} from "../../../where-clause";
import {FromClauseUtil} from "../../../from-clause";
import {IsolableDeleteConnection} from "../../connection";
import * as impl from "./delete";
import {RowNotFoundError, TooManyRowsFoundError} from "../../../error";

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

    return connection.transactionIfNotInOne(async (connection) : Promise<DeleteOneResult> => {
        const result = await impl.delete(
            table,
            connection,
            whereDelegate
        );
        if (tm.BigIntUtil.equal(result.deletedRowCount, tm.BigInt(0))) {
            throw new RowNotFoundError(
                `Expected to delete one row of ${table.alias}; found ${result.deletedRowCount} rows`,
                result.query.sql
            );
        }
        if (tm.BigIntUtil.equal(result.deletedRowCount, tm.BigInt(1))) {
            return result as DeleteOneResult;
        }
        throw new TooManyRowsFoundError(
            `Expected to delete one row of ${table.alias}; found ${result.deletedRowCount} rows`,
            result.query.sql
        );
    });
}

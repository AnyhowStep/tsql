import * as tm from "type-mapping";
import {ITablePerType} from "../../table-per-type";
import {IsolableUpdateConnection, ExecutionUtil} from "../../../execution";
import * as ExprLib from "../../../expr-library";
import {PrimaryKey_Input} from "../../../primary-key";
import {UpdateAndFetchZeroOrOneReturnType} from "./update-and-fetch-zero-or-one-by-candidate-key";
import {QueryUtil} from "../../../unified-query";
import {updateAndFetchOneByPrimaryKey} from "./update-and-fetch-one-by-primary-key";
import {CustomAssignmentMap, AssignmentMapDelegate} from "./assignment-map";

export async function updateAndFetchZeroOrOneByPrimaryKey<
    TptT extends ITablePerType,
    AssignmentMapT extends CustomAssignmentMap<TptT>
> (
    tpt : TptT,
    connection : IsolableUpdateConnection,
    primaryKey : PrimaryKey_Input<TptT["childTable"]>,
    assignmentMapDelegate : AssignmentMapDelegate<TptT, AssignmentMapT>
) : Promise<UpdateAndFetchZeroOrOneReturnType<TptT, AssignmentMapT>> {
    return connection.transactionIfNotInOne(async (connection) : Promise<UpdateAndFetchZeroOrOneReturnType<TptT, AssignmentMapT>> => {
        const existsResult = await ExecutionUtil.existsImpl(
            QueryUtil.newInstance()
                .from(tpt.childTable as any)
                .where(() => ExprLib.eqPrimaryKey(
                    tpt.childTable,
                    primaryKey
                )),
            connection
        );

        if (!existsResult.exists) {
            return {
                query : {
                    sql : existsResult.sql,
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
            };
        }
        return updateAndFetchOneByPrimaryKey(
            tpt,
            connection,
            primaryKey,
            assignmentMapDelegate
        );
    });
}

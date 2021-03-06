import * as tm from "type-mapping";
import {ITablePerType} from "../../table-per-type";
import {IsolableUpdateConnection} from "../../../execution";
import {UpdateAndFetchZeroOrOneReturnType} from "./update-and-fetch-zero-or-one-by-candidate-key";
import {SuperKey} from "../query";
import {eqSuperKey} from "../operation";
import {updateAndFetchOneBySuperKey} from "./update-and-fetch-one-by-super-key";
import {existsImpl} from "../execution-impl";
import {CustomAssignmentMap, AssignmentMapDelegate} from "./assignment-map";
import {IsolationLevel} from "../../../isolation-level";

export async function updateAndFetchZeroOrOneBySuperKey<
    TptT extends ITablePerType,
    AssignmentMapT extends CustomAssignmentMap<TptT>
> (
    tpt : TptT,
    connection : IsolableUpdateConnection,
    superKey : SuperKey<TptT>,
    assignmentMapDelegate : AssignmentMapDelegate<TptT, AssignmentMapT>
) : Promise<UpdateAndFetchZeroOrOneReturnType<TptT, AssignmentMapT>> {
    return connection.transactionIfNotInOne(IsolationLevel.REPEATABLE_READ, async (connection) : Promise<UpdateAndFetchZeroOrOneReturnType<TptT, AssignmentMapT>> => {
        const existsResult = await existsImpl(
            tpt,
            connection,
            () => eqSuperKey(
                tpt,
                superKey
            ) as any
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
        return updateAndFetchOneBySuperKey(
            tpt,
            connection,
            superKey,
            assignmentMapDelegate
        );
    });
}

import * as tm from "type-mapping";
import {ITablePerType} from "../../table-per-type";
import {CandidateKey_NonUnion} from "../../../candidate-key";
import {StrictUnion, Identity} from "../../../type-util";
import {IsolableUpdateConnection, ExecutionUtil} from "../../../execution";
import * as ExprLib from "../../../expr-library";
import {UpdatedAndFetchedRow, updateAndFetchOneByCandidateKey} from "./update-and-fetch-one-by-candidate-key";
import {NotFoundUpdateAndFetchResult} from "../../../execution/util";
import {QueryUtil} from "../../../unified-query";
import {UpdateAndFetchOneResult} from "../execution-impl";
import {CustomAssignmentMap, AssignmentMapDelegate} from "./assignment-map";

export type UpdateAndFetchZeroOrOneReturnType<
    TptT extends ITablePerType,
    AssignmentMapT extends CustomAssignmentMap<TptT>
> =
    Identity<
        | UpdateAndFetchOneResult<
            UpdatedAndFetchedRow<TptT, AssignmentMapT>
        >
        | NotFoundUpdateAndFetchResult
    >
;

export async function updateAndFetchZeroOrOneByCandidateKey<
    TptT extends ITablePerType,
    CandidateKeyT extends StrictUnion<CandidateKey_NonUnion<TptT["childTable"]>>,
    AssignmentMapT extends CustomAssignmentMap<TptT>
> (
    tpt : TptT,
    connection : IsolableUpdateConnection,
    /**
     * @todo Try and recall why I wanted `AssertNonUnion<>`
     * I didn't write compile-time tests for it...
     */
    candidateKey : CandidateKeyT,// & AssertNonUnion<CandidateKeyT>,
    assignmentMapDelegate : AssignmentMapDelegate<TptT, AssignmentMapT>
) : Promise<UpdateAndFetchZeroOrOneReturnType<TptT, AssignmentMapT>> {
    return connection.transactionIfNotInOne(async (connection) : Promise<UpdateAndFetchZeroOrOneReturnType<TptT, AssignmentMapT>> => {
        const existsResult = await ExecutionUtil.existsImpl(
            QueryUtil.newInstance()
                .from(tpt.childTable as any)
                .where(() => ExprLib.eqCandidateKey(
                    tpt.childTable,
                    candidateKey
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
        return updateAndFetchOneByCandidateKey(
            tpt,
            connection,
            candidateKey,
            assignmentMapDelegate
        );
    });
}

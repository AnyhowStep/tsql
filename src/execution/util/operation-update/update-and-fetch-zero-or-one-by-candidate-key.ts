import {ITable} from "../../../table";
import {IsolableUpdateConnection} from "../../connection";
import {AssignmentMapDelegate} from "../../../update";
import {CandidateKey_NonUnion} from "../../../candidate-key";
import {StrictUnion} from "../../../type-util";
import * as ExprLib from "../../../expr-library";
import {UpdateAndFetchOneByCandidateKeyAssignmentMap, __updateAndFetchOneByCandidateKeyHelper} from "./update-and-fetch-one-by-candidate-key";
import {UpdateAndFetchZeroOrOneResult, updateAndFetchZeroOrOneImpl} from "./update-and-fetch-zero-or-one-impl";

export async function updateAndFetchZeroOrOneByCandidateKey<
    TableT extends ITable,
    CandidateKeyT extends StrictUnion<CandidateKey_NonUnion<TableT>>,
    AssignmentMapT extends UpdateAndFetchOneByCandidateKeyAssignmentMap<TableT>
> (
    table : TableT,
    connection : IsolableUpdateConnection,
    candidateKey : CandidateKeyT,// & AssertNonUnion<CandidateKeyT>,
    assignmentMapDelegate : AssignmentMapDelegate<TableT, AssignmentMapT>
) : Promise<UpdateAndFetchZeroOrOneResult<TableT, AssignmentMapT>> {
    return updateAndFetchZeroOrOneImpl<
        TableT,
        AssignmentMapT
    >(
        table,
        connection,
        async (connection) => {
            const helperResult = await __updateAndFetchOneByCandidateKeyHelper<
                TableT,
                CandidateKeyT,
                AssignmentMapT
            >(
                table,
                connection,
                candidateKey,
                assignmentMapDelegate
            );
            if (!helperResult.success) {
                return helperResult;
            }
            const {
                curCandidateKey,
                assignmentMap,
                newCandidateKey,
            } = helperResult;
            return {
                success : true,
                updateWhereDelegate : () => ExprLib.eqCandidateKey(
                    table,
                    curCandidateKey
                ) as any,
                fetchWhereDelegate : () => ExprLib.eqCandidateKey(
                    table,
                    newCandidateKey
                ) as any,
                /**
                 * This cast is unsound.
                 * What we have is not `AssignmentMapT`.
                 *
                 * We have a `BuiltInExpr` version of `AssignmentMapT`,
                 * with some parts possibly being evaluated to a value expression.
                 *
                 * However, this will not affect the correctness of
                 * our results.
                 */
                assignmentMap : assignmentMap as AssignmentMapT,
            };
        }
    );
}

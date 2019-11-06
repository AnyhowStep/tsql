import * as tm from "type-mapping";
import {ITable, TableUtil} from "../../../table";
import {IsolableUpdateConnection} from "../../connection";
import {AssignmentMapDelegate, AssignmentMap} from "../../../update";
import {CandidateKey_NonUnion} from "../../../candidate-key";
import {StrictUnion, AssertNonUnion} from "../../../type-util";
import {UpdateOneResult} from "./update-one";
import * as ExprLib from "../../../expr-library";
import {NotFoundUpdateResult, updateZeroOrOne} from "./update-zero-or-one";
import {UpdateAndFetchOneResult, UpdateAndFetchOneByCandidateKeyAssignmentMap, __updateAndFetchOneByCandidateKeyHelper} from "./update-and-fetch-one-by-candidate-key";

export interface NotFoundUpdateAndFetchResult extends NotFoundUpdateResult {
    row : undefined,
}

export type UpdateAndFetchZeroOrOneResult<
    TableT extends ITable,
    AssignmentMapT extends AssignmentMap<TableT>
> =
    | NotFoundUpdateAndFetchResult
    | UpdateAndFetchOneResult<TableT, AssignmentMapT>
;

export async function updateAndFetchZeroOrOneByCandidateKey<
    TableT extends ITable,
    CandidateKeyT extends StrictUnion<CandidateKey_NonUnion<TableT>>,
    AssignmentMapT extends UpdateAndFetchOneByCandidateKeyAssignmentMap<TableT, CandidateKeyT>
> (
    table : TableT,
    connection : IsolableUpdateConnection,
    candidateKey : CandidateKeyT & AssertNonUnion<CandidateKeyT>,
    assignmentMapDelegate : AssignmentMapDelegate<TableT, AssignmentMapT>
) : Promise<UpdateAndFetchZeroOrOneResult<TableT, AssignmentMapT>> {
    const {
        curCandidateKey,
        assignmentMap,
        newCandidateKey,
    } = __updateAndFetchOneByCandidateKeyHelper<
        TableT,
        CandidateKeyT,
        AssignmentMapT
    >(
        table,
        candidateKey,
        assignmentMapDelegate
    );

    return connection.transactionIfNotInOne(async (connection) : Promise<UpdateAndFetchZeroOrOneResult<TableT, AssignmentMapT>> => {
        const updateZeroOrOneResult = await updateZeroOrOne(
            table,
            connection,
            () => ExprLib.eqCandidateKey(
                table,
                curCandidateKey
            ) as any,
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
                () => ExprLib.eqCandidateKey(
                    table,
                    newCandidateKey
                ) as any
            );
            return {
                ...updateOneResult,
                row,
            };
        }
    });
}

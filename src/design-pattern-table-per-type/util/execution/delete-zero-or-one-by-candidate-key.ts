import {DeletableTablePerType} from "../../table-per-type";
import {CandidateKey_NonUnion} from "../../../candidate-key";
import {StrictUnion} from "../../../type-util";
import {IsolableDeleteConnection} from "../../../execution";
import * as ExprLib from "../../../expr-library";
import {DeleteZeroOrOneResult, deleteZeroOrOneImpl} from "../execution-impl";

export async function deleteZeroOrOneByCandidateKey<
    TptT extends DeletableTablePerType,
    CandidateKeyT extends StrictUnion<CandidateKey_NonUnion<TptT["childTable"]>>
> (
    tpt : TptT,
    connection : IsolableDeleteConnection,
    /**
     * @todo Try and recall why I wanted `AssertNonUnion<>`
     * I didn't write compile-time tests for it...
     */
    candidateKey : CandidateKeyT,// & AssertNonUnion<CandidateKeyT>
) : Promise<DeleteZeroOrOneResult> {
    return deleteZeroOrOneImpl(
        tpt,
        connection,
        () => ExprLib.eqCandidateKey(
            tpt.childTable,
            candidateKey
        )
    );
}

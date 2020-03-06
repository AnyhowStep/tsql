import {ITablePerType} from "../../table-per-type";
import {SelectConnection} from "../../../execution";
import * as ExprLib from "../../../expr-library";
import {fetchOne} from "./fetch-one";
import {FetchOnePromise} from "../../../execution/util";
import {Row} from "../query";
import {CandidateKey_NonUnion} from "../../../candidate-key";
import {StrictUnion} from "../../../type-util";

export function fetchOneByCandidateKey<TptT extends ITablePerType> (
    tpt : TptT,
    connection : SelectConnection,
    candidateKey : StrictUnion<CandidateKey_NonUnion<TptT["childTable"]>>
) : FetchOnePromise<Row<TptT>> {
    return fetchOne(
        tpt,
        connection,
        () => ExprLib.eqCandidateKey(
            tpt.childTable,
            candidateKey
        )
    );
}

import * as tm from "type-mapping";
import {Key} from "../../../key";
import {ITablePerType} from "../../table-per-type";
import {CandidateKey_NonUnionImpl} from "../../../candidate-key";
import {ColumnAlias, columnAliases} from "./column-alias";
import {ColumnType, columnMapper} from "./column-type";

export type SuperKey_FromCandidateKeyImpl<
    TptT extends ITablePerType,
    CandidateKeyT extends Key
> =
    CandidateKeyT extends Key ?
    (
        & CandidateKey_NonUnionImpl<TptT["childTable"]["columns"], CandidateKeyT>
        & {
            [columnName in Exclude<
                ColumnAlias<TptT>,
                CandidateKeyT[number]
            >]? : (
                ColumnType<TptT, columnName>
            )
        }
    ) :
    never
;
function superKeyMapper_FromCandidateKeyImpl<
    TptT extends ITablePerType,
    CandidateKeyT extends Key
> (
    tpt : TptT,
    candidateKey : CandidateKeyT
) : (
    tm.SafeMapper<SuperKey_FromCandidateKeyImpl<TptT, CandidateKeyT>>
) {
    const result = tm.objectFromArray(...columnAliases(tpt).map(columnAlias => {
        const mapper = tm.withName(
            columnMapper(tpt, columnAlias),
            columnAlias
        );
        if (candidateKey.includes(columnAlias)) {
            return mapper as (
                & tm.SafeMapper<unknown>
                & tm.Name<string>
            );
        } else {
            return tm.optional(mapper) as (
                & tm.SafeMapper<unknown>
                & tm.Name<string>
            );
        }
    }));
    return result as tm.SafeMapper<SuperKey_FromCandidateKeyImpl<TptT, CandidateKeyT>>;
}
export type SuperKey<
    TptT extends ITablePerType
> =
    SuperKey_FromCandidateKeyImpl<
        TptT,
        TptT["childTable"]["candidateKeys"][number]
    >
;
export function superKeyMapper<
    TptT extends ITablePerType
> (
    tpt : TptT
) : tm.SafeMapper<SuperKey<TptT>> {
    const arr = tpt.childTable.candidateKeys.map(candidateKey => {
        return superKeyMapper_FromCandidateKeyImpl(tpt, candidateKey);
    });
    return tm.unsafeOr(
        ...arr
    ) as tm.SafeMapper<SuperKey<TptT>>;
}

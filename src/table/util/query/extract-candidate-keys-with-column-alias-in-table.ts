import {ITable} from "../../table";
import {KeyUtil, Key} from "../../../key";
import {ExtractCandidateKeysInCommon} from "./extract-candidate-keys-in-common";

/**
 * + Assumes `CandidateKeysT` may be a union
 * + Assumes `ColumnAliasesT` may be a union
 * + Meant for input/write/contravariant positions.
 *
 * Extracts all candidate keys of `CandidateKeysT` with matching column aliases in `ColumnAliasesT`
 */
export type ExtractCandidateKeysWithColumnAliasInTable_Input<
    CandidateKeysT extends Pick<ITable, "candidateKeys">,
    ColumnAliasesT extends Pick<ITable, "columns">
> = (
    KeyUtil.ExtractIfInColumnMap<
        ExtractCandidateKeysInCommon<CandidateKeysT>,
        ColumnAliasesT["columns"]
    >
);

/**
 * + Assumes `CandidateKeysT` may be a union
 * + Assumes `ColumnAliasesT` may be a union
 * + Meant for output/read/covariant positions.
 *
 * Extracts all candidate keys of `CandidateKeysT` with matching column aliases in `ColumnAliasesT`
 */
export type ExtractCandidateKeysWithColumnAliasInTable_Output<
    CandidateKeysT extends Pick<ITable, "candidateKeys">,
    ColumnAliasesT extends Pick<ITable, "columns">
> = (
    CandidateKeysT extends Pick<ITable, "candidateKeys"> ?
    (
        ColumnAliasesT extends Pick<ITable, "columns"> ?
        ExtractCandidateKeysWithColumnAliasInTable_Input<
            CandidateKeysT,
            ColumnAliasesT
        > :
        never
    ) :
    never
);

export function extractCandidateKeysWithColumnAliasInTable<
    CandidateKeysT extends Pick<ITable, "candidateKeys">,
    ColumnAliasesT extends Pick<ITable, "columns">
> (
    candidateKeysTable : CandidateKeysT,
    columnAliasesTable : ColumnAliasesT
) : (
    ExtractCandidateKeysWithColumnAliasInTable_Output<
        CandidateKeysT,
        ColumnAliasesT
    >[]
) {
    const result : Key[] = [];
    const columnAliases = Object.keys(columnAliasesTable.columns);
    for (const candidateKey of candidateKeysTable.candidateKeys) {
        if (KeyUtil.isSubKey(candidateKey, columnAliases)) {
            result.push(candidateKey);
        }
    }
    return result as ExtractCandidateKeysWithColumnAliasInTable_Output<
        CandidateKeysT,
        ColumnAliasesT
    >[];
}

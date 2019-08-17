import {ITable} from "../../table";
import {KeyUtil} from "../../../key";
import {ExtractCandidateKeysInCommon} from "./extract-candidate-keys-in-common";
import {IColumn} from "../../../column";

/**
 * + Assumes `CandidateKeysT` may be a union
 * + Assumes `ColumnAliasesT` may be a union
 *
 * Extracts all candidate keys of `CandidateKeysT` with matching column aliases in one of `ColumnAliasesT`
 */
export type ExtractCandidateKeysWithColumnAliasInOneOfColumnArray<
    CandidateKeysT extends Pick<ITable, "candidateKeys">,
    ColumnAliasesT extends readonly Pick<IColumn, "columnAlias">[]
> = (
    ColumnAliasesT extends readonly Pick<IColumn, "columnAlias">[] ?
    KeyUtil.ExtractIfInKeyArray<
        ExtractCandidateKeysInCommon<CandidateKeysT>,
        KeyUtil.FromColumnArray<ColumnAliasesT>[]
    > :
    never
);

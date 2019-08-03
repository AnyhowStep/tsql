import {IAliasedTable} from "../../aliased-table";
import {ITable, TableUtil} from "../../../table";

export type CandidateKeys<AliasedTableT extends IAliasedTable> = (
    AliasedTableT extends ITable ?
    AliasedTableT["candidateKeys"] :
    readonly []
);

export function candidateKeys<AliasedTableT extends IAliasedTable> (
    aliasedTable : AliasedTableT
) : (
    CandidateKeys<AliasedTableT>
) {
    if (TableUtil.isTable(aliasedTable)) {
        return aliasedTable.candidateKeys as CandidateKeys<AliasedTableT>;
    } else {
        return [] as readonly [] as CandidateKeys<AliasedTableT>;
    }
}

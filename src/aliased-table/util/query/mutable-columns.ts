import {IAliasedTable} from "../../aliased-table";
import {ITable, TableUtil} from "../../../table";

export type MutableColumns<AliasedTableT extends IAliasedTable> = (
    AliasedTableT extends ITable ?
    AliasedTableT["mutableColumns"] :
    readonly []
);

export function mutableColumns<AliasedTableT extends IAliasedTable> (
    aliasedTable : AliasedTableT
) : (
    MutableColumns<AliasedTableT>
) {
    if (TableUtil.isTable(aliasedTable)) {
        return aliasedTable.mutableColumns as MutableColumns<AliasedTableT>;
    } else {
        return [] as readonly [] as MutableColumns<AliasedTableT>;
    }
}

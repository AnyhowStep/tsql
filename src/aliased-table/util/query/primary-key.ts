import {IAliasedTable} from "../../aliased-table";
import {ITable, TableUtil} from "../../../table";

export type PrimaryKey<AliasedTableT extends IAliasedTable> = (
    AliasedTableT extends ITable ?
    AliasedTableT["primaryKey"] :
    undefined
);
export function primaryKey<AliasedTableT extends IAliasedTable> (
    aliasedTable : AliasedTableT
) : (
    PrimaryKey<AliasedTableT>
) {
    if (TableUtil.isTable(aliasedTable)) {
        return aliasedTable.primaryKey as PrimaryKey<AliasedTableT>;
    } else {
        return undefined as PrimaryKey<AliasedTableT>;
    }
}

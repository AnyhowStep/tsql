import {IAliasedTable} from "../../aliased-table";
import {ITable, TableUtil} from "../../../table";

export type DeleteEnabled<AliasedTableT extends IAliasedTable> = (
    AliasedTableT extends ITable ?
    AliasedTableT["deleteEnabled"] :
    false
);

export function deleteEnabled<AliasedTableT extends IAliasedTable> (
    aliasedTable : AliasedTableT
) : (
    DeleteEnabled<AliasedTableT>
) {
    if (TableUtil.isTable(aliasedTable)) {
        return aliasedTable.deleteEnabled as DeleteEnabled<AliasedTableT>;
    } else {
        return false as DeleteEnabled<AliasedTableT>;
    }
}

import {ITable, DeletableTable} from "../../table";

export function isDeleteEnabled (table : ITable) : table is DeletableTable {
    return table.deleteEnabled;
}

export function assertDeleteEnabled (table : ITable) {
    if (!isDeleteEnabled(table)) {
        throw new Error(`Cannot DELETE FROM/REPLACE INTO ${table.alias}`);
    }
}

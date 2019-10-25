import {ITable, InsertableTable} from "../../table";

export function isInsertEnabled (table : ITable) : table is InsertableTable {
    return table.insertEnabled;
}

export function assertInsertEnabled (table : ITable) {
    if (!isInsertEnabled(table)) {
        throw new Error(`Cannot INSERT INTO ${table.alias}`);
    }
}

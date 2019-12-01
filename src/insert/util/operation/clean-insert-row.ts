import {ITable, TableUtil} from "../../../table";
import {CustomInsertRow, BuiltInInsertRow} from "../../insert-row";
import {cleanInsertColumn} from "./clean-insert-column";

/**
 * + Removes excess properties.
 * + Removes properties with value `undefined`.
 * + Checks required properties are there.
 */
export function cleanInsertRow<TableT extends ITable> (table : TableT, row : CustomInsertRow<TableT>) : BuiltInInsertRow<TableT> {
    const result = {} as CustomInsertRow<TableT>;
    for (const requiredColumnAlias of TableUtil.requiredColumnAlias(table)) {
        result[requiredColumnAlias] = cleanInsertColumn(
            table,
            row,
            requiredColumnAlias,
            true
        ) as any;
    }

    for (const optionalColumnAlias of TableUtil.optionalColumnAlias(table)) {
        const value = cleanInsertColumn(
            table,
            row,
            optionalColumnAlias,
            false
        );
        if (value === undefined) {
            continue;
        }
        result[optionalColumnAlias] = value as any;
    }

    return result;
}

import * as tm from "type-mapping";
import {ColumnMap} from "../../../column-map";
import {IsNullSafeComparable} from "../../../type-util";
import {TableWithPrimaryKey} from "../../table";

/**
 * Returns `true` if all primary key columns of `TableT`
 * are **null-safe** comparable with columns in `ColumnMapT` that have the same name
 *
 * Assumes `TableT` is not a union
 */
export type HasNullSafeComparablePrimaryKey<
    TableT extends Pick<TableWithPrimaryKey, "columns"|"primaryKey">,
    ColumnMapT extends ColumnMap
> = (
    {
        [k in TableT["primaryKey"][number]] : (
            k extends Extract<keyof ColumnMapT, string> ?
            IsNullSafeComparable<
                tm.OutputOf<TableT["columns"][k]["mapper"]>,
                tm.OutputOf<ColumnMapT[k]["mapper"]>
            > :
            //`k` is not a columnAlias of `ColumnMapT`
            false
        )
    }[TableT["primaryKey"][number]]
);

/**
 * Ideally, we'd want to have run-time checks
 * ensuring PK columns and `columnMap` columns
 * have null-safe comparable types.
 *
 * However, due to how the project is structured,
 * this is not possible.
 *
 * So, at the very least, we just check
 * the columns exist.
 */
export function hasNullSafeComparablePrimaryKey (
    table : Pick<TableWithPrimaryKey, "columns"|"primaryKey">,
    columnMap : ColumnMap
) : boolean {
    /**
     * Ideally, we'd want to have run-time checks
     * ensuring PK columns and `columnMap` columns
     * have null-safe comparable types.
     *
     * However, due to how the project is structured,
     * this is not possible.
     *
     * So, at the very least, we just check
     * the columns exist.
     */
    const myColumnAliases : string[] = Object.keys(table.columns);
    for (const pkColumnAlias of table.primaryKey) {
        if (!myColumnAliases.includes(pkColumnAlias)) {
            /**
             * My column does not exist
             */
            return false;
        }
    }
    const otherColumnAliases : string[] = Object.keys(columnMap);
    for (const pkColumnAlias of table.primaryKey) {
        if (!otherColumnAliases.includes(pkColumnAlias)) {
            /**
             * Other column does not exist
             */
            return false;
        }
    }

    return true;
}

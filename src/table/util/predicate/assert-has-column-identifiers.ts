import {ITable} from "../../table";
import {IColumn} from "../../../column";
import {ColumnIdentifierMapUtil} from "../../../column-identifier-map";

/**
 * A run-time check mostly for JS-land users.
 *
 * Checks that the `table` contains all `columns` passed through,
 * using just the `tableAlias` and `columnAlias`.
 *
 * @param table
 * @param columns
 */
export function assertHasColumnIdentifiers (
    table : Pick<ITable, "columns">,
    columns : readonly IColumn[]
) {
    for (const column of columns) {
        ColumnIdentifierMapUtil.assertHasColumnIdentifier(table.columns, column);
    }
}

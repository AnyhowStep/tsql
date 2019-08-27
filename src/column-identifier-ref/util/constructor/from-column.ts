import {IColumn} from "../../../column";
import {ColumnIdentifierMapUtil} from "../../../column-identifier-map";
import {ColumnIdentifierUtil} from "../../../column-identifier";
import {WritableColumnIdentifierRef} from "../../column-identifier-ref";
import {ColumnIdentifier} from "../../../column-identifier/column-identifier";

export type FromColumn<ColumnT extends IColumn> = (
    ColumnT extends IColumn ?
    {
        readonly [tableAlias in ColumnT["tableAlias"]] : (
            ColumnIdentifierMapUtil.FromColumn<ColumnT>
        )
    } :
    never
);
export function appendColumn (
    ref : WritableColumnIdentifierRef,
    column : ColumnIdentifier
) {
    let map = ref[column.tableAlias];
    if (map == undefined) {
        map = {};
        ref[column.tableAlias] = map;
    }
    map[column.columnAlias] = ColumnIdentifierUtil.fromColumn(column);
    return ref;
}

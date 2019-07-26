import {IColumn} from "../../../column";
import {ColumnMapUtil} from "../../../column-map";
import {WritableColumnRef} from "../../column-ref";

export type FromColumn<ColumnT extends IColumn> = (
    ColumnT extends IColumn ?
    {
        readonly [tableAlias in ColumnT["tableAlias"]] : (
            ColumnMapUtil.FromColumn<ColumnT>
        )
    } :
    never
);
export function setColumn (
    ref : WritableColumnRef,
    column : IColumn
) : WritableColumnRef {
    let map = ref[column.tableAlias];
    if (map == undefined) {
        map = {};
        ref[column.tableAlias] = map;
    }
    map[column.columnAlias] = column;
    return ref;
}
export function fromColumn<ColumnT extends IColumn> (
    column : ColumnT
) : FromColumn<ColumnT> {
    return setColumn({}, column) as FromColumn<ColumnT>;
}
import {IUsedRef} from "../../used-ref";
import {TypeRefUtil} from "../../../type-ref";
import {IColumn} from "../../../column";

export type FromColumn<ColumnT extends IColumn> = (
    IUsedRef<TypeRefUtil.FromColumn<ColumnT>>
);

export function fromColumn<ColumnT extends IColumn> (
    column : ColumnT
) : (
    FromColumn<ColumnT>
) {
    const result : FromColumn<ColumnT> = {
        __contravarianceMarker : () => {},
        columns : {
            [column.tableAlias] : {
                [column.columnAlias] : column
            }
        },
    };
    return result;
}

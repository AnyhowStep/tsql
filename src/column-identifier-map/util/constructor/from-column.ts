import {ColumnIdentifierUtil} from "../../../column-identifier";
import {IColumn} from "../../../column";

export type FromColumn<ColumnT extends IColumn> = (
    ColumnT extends IColumn ?
    {
        readonly [columnAlias in ColumnT["columnAlias"]] : (
            ColumnIdentifierUtil.FromColumn<ColumnT>
        )
    } :
    never
);

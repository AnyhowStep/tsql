import {IColumn, ColumnUtil} from "../../../column";

export type FromColumnUnion<ColumnT extends IColumn> = (
    {
        readonly [columnAlias in ColumnT["columnAlias"]] : (
            ColumnUtil.ExtractWithColumnAlias<ColumnT, columnAlias>
        )
    }
);

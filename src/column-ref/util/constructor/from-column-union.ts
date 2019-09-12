import {ColumnMapUtil} from "../../../column-map";
import {IColumn, ColumnUtil} from "../../../column";

export type FromColumnUnion<ColumnT extends IColumn> = (
    {
        readonly [tableAlias in ColumnT["tableAlias"]] : (
            ColumnMapUtil.FromColumnUnion<
                ColumnUtil.ExtractWithTableAlias<ColumnT, tableAlias>
            >
        )
    }
);

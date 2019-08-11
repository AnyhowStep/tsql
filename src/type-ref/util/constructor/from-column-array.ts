import {IColumn, ColumnUtil} from "../../../column";
import {TypeMapUtil} from "../../../type-map";

export type FromColumnArray<ColumnsT extends readonly IColumn[]> = (
    {
        readonly [tableAlias in ColumnsT[number]["tableAlias"]] : (
            TypeMapUtil.FromColumnArray<
                ColumnUtil.ExtractWithTableAlias<
                    ColumnsT[number],
                    tableAlias
                >[]
            >
        )
    }
);

import {IColumn, ColumnUtil} from "../../../column";

export type FromColumnArray<ColumnsT extends readonly IColumn[]> = (
    ColumnsT extends readonly IColumn[] ?
    {
        readonly [columnAlias in ColumnsT[number]["columnAlias"]] : (
            ColumnUtil.ExtractWithColumnAlias<
                ColumnsT[number],
                columnAlias
            >
        )
    } :
    never
);

import {IColumn, ColumnUtil} from "../../../column";
import {WritableColumnMap} from "../../column-map";

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
export function fromColumnArray<ColumnsT extends readonly IColumn[]> (
    columns : ColumnsT
) : FromColumnArray<ColumnsT> {
    const result : WritableColumnMap = {};
    for (const column of columns) {
        result[column.columnAlias] = column;
    }
    return result as FromColumnArray<ColumnsT>;
}

import * as tm from "type-mapping";
import {IColumn} from "../../column";

export type ExtractNullable<
    ColumnT extends IColumn
> = (
    ColumnT extends IColumn ?
    (
        null extends tm.OutputOf<ColumnT["mapper"]> ?
        ColumnT :
        never
    ) :
    never
);
export function extractNullable<
    ColumnsT extends readonly IColumn[]
> (
    columns : ColumnsT
) : (
    ExtractNullable<ColumnsT[number]>[]
) {
    const result : IColumn[] = [];
    for (const column of columns) {
        if (tm.canOutputNull(column.mapper)) {
            result.push(column);
        }
    }
    return result as ExtractNullable<ColumnsT[number]>[];
}

import {IColumn, ColumnUtil} from "../../../column";
import {ColumnMapUtil} from "../../../column-map";
import {WritableColumnRef} from "../../column-ref";
import {setColumn} from "./from-column";

export type FromColumnArray<ColumnsT extends readonly IColumn[]> = (
    ColumnsT extends readonly IColumn[] ?
    {
        readonly [tableAlias in ColumnsT[number]["tableAlias"]] : (
            ColumnMapUtil.FromColumnArray<
                ColumnUtil.ExtractWithTableAlias<
                    ColumnsT[number],
                    tableAlias
                >[]
            >
        )
    } :
    never
);
export function fromColumnArray<ColumnsT extends readonly IColumn[]> (
    columns : ColumnsT
) : FromColumnArray<ColumnsT> {
    const result : WritableColumnRef = {};
    for (const column of columns) {
        setColumn(result, column);
    }
    return result as FromColumnArray<ColumnsT>;
}

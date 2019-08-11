import * as tm from "type-mapping";
import {IColumn, ColumnUtil} from "../../../column";

export type FromColumnArray<ColumnsT extends readonly IColumn[]> = (
    {
        readonly [columnAlias in ColumnsT[number]["columnAlias"]] : (
            tm.OutputOf<
                ColumnUtil.ExtractWithColumnAlias<
                    ColumnsT[number],
                    columnAlias
                >["mapper"]
            >
        )
    }
);

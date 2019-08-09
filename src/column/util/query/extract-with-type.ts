import * as tm from "type-mapping";
import {IColumn} from "../../column";

export type ExtractWithType<
    ColumnT extends IColumn,
    TypeT
> = (
    ColumnT extends IColumn ?
    (
        tm.OutputOf<ColumnT["mapper"]> extends TypeT ?
        ColumnT :
        never
    ) :
    never
);

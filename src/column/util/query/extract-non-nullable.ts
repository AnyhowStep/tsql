import * as tm from "type-mapping";
import {IColumn} from "../../column";

export type ExtractNonNullable<
    ColumnT extends IColumn
> = (
    ColumnT extends IColumn ?
    (
        null extends tm.OutputOf<ColumnT["mapper"]> ?
        never :
        ColumnT
    ) :
    never
);

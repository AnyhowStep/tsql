import * as tm from "type-mapping";
import {IColumn} from "../../../column";

export type FromColumn<ColumnT extends Pick<IColumn, "tableAlias"|"columnAlias"|"mapper">> = (
    ColumnT extends Pick<IColumn, "tableAlias"|"columnAlias"|"mapper"> ?
    {
        readonly [tableAlias in ColumnT["tableAlias"]] : (
            {
                readonly [columnAlias in ColumnT["columnAlias"]] : (
                    tm.OutputOf<ColumnT["mapper"]>
                )
            }
        )
    } :
    never
);

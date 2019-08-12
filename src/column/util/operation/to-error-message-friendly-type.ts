import * as tm from "type-mapping";
import {IColumn} from "../../column";

/**
 * Used to generate nicer looking error messages
 */
export type ToErrorMessageFriendlyType<ColumnT extends IColumn> = (
    ColumnT extends IColumn ?
    (
        [
            ColumnT["tableAlias"],
            ColumnT["columnAlias"],
            tm.OutputOf<ColumnT["mapper"]>
        ]
    ) :
    never
);

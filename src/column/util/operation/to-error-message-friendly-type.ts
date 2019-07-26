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
            ReturnType<ColumnT["mapper"]>
        ]
    ) :
    never
);

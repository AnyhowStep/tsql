import {ColumnIdentifier} from "../../column-identifier";

/**
 * Used to generate nicer looking error messages
 */
export type ToErrorMessageFriendlyType<ColumnIdentifierT extends ColumnIdentifier> = (
    ColumnIdentifierT extends ColumnIdentifier ?
    (
        [
            ColumnIdentifierT["tableAlias"],
            ColumnIdentifierT["columnAlias"],
        ]
    ) :
    never
);

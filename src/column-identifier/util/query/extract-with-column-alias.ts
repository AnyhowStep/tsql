import {ColumnIdentifier} from "../../column-identifier";

export type ExtractWithColumnAlias<
    ColumnIdentifierT extends ColumnIdentifier,
    ColumnAliasT extends string
> = (
    ColumnIdentifierT extends ColumnIdentifier ?
    (
        ColumnIdentifierT["columnAlias"] extends ColumnAliasT ?
        ColumnIdentifierT :
        never
    ) :
    never
);

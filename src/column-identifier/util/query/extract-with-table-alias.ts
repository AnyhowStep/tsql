import {ColumnIdentifier} from "../../column-identifier";

export type ExtractWithTableAlias<
    ColumnIdentifierT extends ColumnIdentifier,
    TableAliasT extends string
> = (
    ColumnIdentifierT extends ColumnIdentifier ?
    (
        ColumnIdentifierT["tableAlias"] extends TableAliasT ?
        ColumnIdentifierT :
        never
    ) :
    never
);

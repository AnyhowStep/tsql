import {IColumn} from "../../column";

export type ExtractWithColumnAlias<
    ColumnT extends IColumn,
    ColumnAliasT extends string
> = (
    Extract<ColumnT, { columnAlias : ColumnAliasT }>
);

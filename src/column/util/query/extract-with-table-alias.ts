import {IColumn} from "../../column";

export type ExtractWithTableAlias<
    ColumnT extends IColumn,
    TableAliasT extends string
> = (
    Extract<ColumnT, { tableAlias : TableAliasT }>
);

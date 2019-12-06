import {ITablePerType} from "../../table-per-type";

export type ExtractTableWithAlias<
    T extends ITablePerType,
    AliasT extends string
> =
    Extract<
        (
            | T["childTable"]
            | T["parentTables"][number]
        ),
        { alias : AliasT }
    >
;

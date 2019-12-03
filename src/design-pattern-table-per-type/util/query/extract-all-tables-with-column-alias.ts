import {ITablePerType} from "../../table-per-type";
import {TableUtil} from "../../../table";

export type ExtractAllTablesWithColumnAlias<TptT extends ITablePerType, ColumnAliasT extends string> =
    TableUtil.ExtractWithColumnAlias<
        (
            | TptT["childTable"]
            | TptT["parentTables"][number]
        ),
        ColumnAliasT
    >
;

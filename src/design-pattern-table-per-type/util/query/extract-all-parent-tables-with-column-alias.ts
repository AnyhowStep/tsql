import {ITablePerType} from "../../table-per-type";
import {TableUtil} from "../../../table";

export type ExtractAllParentTablesWithColumnAlias<TptT extends ITablePerType, ColumnAliasT extends string> =
    TableUtil.ExtractWithColumnAlias<
        TptT["parentTables"][number],
        ColumnAliasT
    >
;

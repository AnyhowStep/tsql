import * as tsql from "../../../../../dist";
import {browserAppKeyTpt, serverAppKeyTpt} from "../app-key-example";

declare function extractAllTablesWithColumnAlias<
    TptT extends tsql.ITablePerType,
    ColumnAliasT extends string
> (
    tpt : TptT,
    columnAlias : ColumnAliasT
) : tsql.TablePerTypeUtil.ExtractAllTablesWithColumnAlias<TptT, ColumnAliasT>;

export const browser_appKeyId = extractAllTablesWithColumnAlias(
    browserAppKeyTpt,
    "appKeyId"
);
export const server_appKeyId = extractAllTablesWithColumnAlias(
    serverAppKeyTpt,
    "appKeyId"
);

export const browser_createdAt = extractAllTablesWithColumnAlias(
    browserAppKeyTpt,
    "createdAt"
);
export const server_createdAt = extractAllTablesWithColumnAlias(
    serverAppKeyTpt,
    "createdAt"
);

export const browser_referer = extractAllTablesWithColumnAlias(
    browserAppKeyTpt,
    "referer"
);
export const server_trustProxy = extractAllTablesWithColumnAlias(
    serverAppKeyTpt,
    "trustProxy"
);

export const browser_doesNotExist = extractAllTablesWithColumnAlias(
    browserAppKeyTpt,
    "doesNotExist"
);
export const server_doesNotExist = extractAllTablesWithColumnAlias(
    serverAppKeyTpt,
    "doesNotExist"
);

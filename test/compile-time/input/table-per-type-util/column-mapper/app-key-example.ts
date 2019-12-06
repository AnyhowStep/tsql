import * as tsql from "../../../../../dist";
import {browserAppKeyTpt, serverAppKeyTpt} from "../app-key-example";

export const browser_createdAt = tsql.TablePerTypeUtil.columnMapper(
    browserAppKeyTpt,
    "createdAt"
);
export const server_createdAt = tsql.TablePerTypeUtil.columnMapper(
    serverAppKeyTpt,
    "createdAt"
);

export const browser_appKeyTypeId = tsql.TablePerTypeUtil.columnMapper(
    browserAppKeyTpt,
    "appKeyTypeId"
);
export const server_appKeyTypeId = tsql.TablePerTypeUtil.columnMapper(
    serverAppKeyTpt,
    "appKeyTypeId"
);

export const browser_referer = tsql.TablePerTypeUtil.columnMapper(
    browserAppKeyTpt,
    "referer"
);
export const server_trustProxy = tsql.TablePerTypeUtil.columnMapper(
    serverAppKeyTpt,
    "trustProxy"
);

export const browser_doesNotExist = tsql.TablePerTypeUtil.columnMapper(
    browserAppKeyTpt,
    "doesNotExist"
);
export const server_doesNotExist = tsql.TablePerTypeUtil.columnMapper(
    serverAppKeyTpt,
    "doesNotExist"
);

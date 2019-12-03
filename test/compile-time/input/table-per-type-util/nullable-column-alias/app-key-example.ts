import * as tsql from "../../../../../dist";
import {browserAppKeyTpt, serverAppKeyTpt} from "../app-key-example";

export const browser = tsql.TablePerTypeUtil.nullableColumnAliases(
    browserAppKeyTpt
);
export const server = tsql.TablePerTypeUtil.nullableColumnAliases(
    serverAppKeyTpt
);

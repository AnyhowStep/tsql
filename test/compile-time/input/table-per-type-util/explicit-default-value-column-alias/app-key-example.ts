import * as tsql from "../../../../../dist";
import {browserAppKeyTpt, serverAppKeyTpt} from "../app-key-example";

export const browser = tsql.TablePerTypeUtil.explicitDefaultValueColumnAliases(
    browserAppKeyTpt
);
export const server = tsql.TablePerTypeUtil.explicitDefaultValueColumnAliases(
    serverAppKeyTpt
);

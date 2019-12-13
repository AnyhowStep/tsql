import * as tsql from "../../../../../dist";
import {browserAppKeyTpt, serverAppKeyTpt} from "../app-key-example";

declare function insertAndFetchRow<T extends tsql.InsertableTablePerType> (t : T) : tsql.TablePerTypeUtil.InsertAndFetchRow<T>;

export const browser = insertAndFetchRow(
    browserAppKeyTpt
);
export const server = insertAndFetchRow(
    serverAppKeyTpt
);

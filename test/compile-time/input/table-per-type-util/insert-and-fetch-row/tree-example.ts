import * as tsql from "../../../../../dist";
import {cTpt} from "../tree-example";

declare function insertAndFetchRow<T extends tsql.InsertableTablePerType> (t : T) : tsql.TablePerTypeUtil.InsertAndFetchRow<T>;

export const c = insertAndFetchRow(
    cTpt
);

import * as tsql from "../../../../../dist";
import {catTpt, dogTpt, catDogTpt} from "../diamond-example";

declare function insertAndFetchRow<T extends tsql.InsertableTablePerType> (t : T) : tsql.TablePerTypeUtil.InsertAndFetchRow<T>;

export const cat = insertAndFetchRow(
    catTpt
);
export const dog = insertAndFetchRow(
    dogTpt
);
export const catDog = insertAndFetchRow(
    catDogTpt
);

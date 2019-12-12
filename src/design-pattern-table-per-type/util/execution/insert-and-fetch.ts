import {InsertableTablePerType} from "../../table-per-type";
import {CustomInsertRowWithPrimaryKey} from "./insert-row";

export type InsertAndFetchRow<
    TptT extends InsertableTablePerType
> =
    CustomInsertRowWithPrimaryKey<TptT>
;

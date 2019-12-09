import {InsertableTablePerType, TablePerTypeWithInsertAndFetchCandidateKeys} from "../../table-per-type";
import {CustomInsertRow, CustomInsertRowWithCandidateKey} from "./insert-row";

export type InsertAndFetchRow<
    TptT extends InsertableTablePerType
> =
    TptT extends TablePerTypeWithInsertAndFetchCandidateKeys ?
    CustomInsertRowWithCandidateKey<TptT> :
    CustomInsertRow<TptT>
;

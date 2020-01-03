import {QueryBaseUtil} from "../../../query-base";
import {InsertableTable} from "../../../table";
import {InsertSelectRow} from "../../../insert-select";
import {InsertIgnoreManyResult} from "./insert-ignore-many";

export interface InsertIgnoreSelect {
    insertIgnoreSelect<
        QueryT extends QueryBaseUtil.AfterSelectClause & QueryBaseUtil.NonCorrelated,
        TableT extends InsertableTable
    > (
        query : QueryT,
        table : TableT,
        row : InsertSelectRow<QueryT, TableT>
    ) : Promise<InsertIgnoreManyResult>;
}

import {QueryBaseUtil} from "../../../query-base";
import {InsertableTable} from "../../../table";
import {InsertSelectRow} from "../../../insert-select";
import {InsertManyResult} from "./insert-many";

export interface InsertSelect {
    insertSelect<
        QueryT extends QueryBaseUtil.AfterSelectClause & QueryBaseUtil.NonCorrelated,
        TableT extends InsertableTable
    > (
        query : QueryT,
        table : TableT,
        row : InsertSelectRow<QueryT, TableT>
    ) : Promise<InsertManyResult>;
}

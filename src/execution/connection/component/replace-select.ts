import {QueryBaseUtil} from "../../../query-base";
import {InsertableTable, DeletableTable} from "../../../table";
import {InsertSelectRow} from "../../../insert-select";
import {ReplaceManyResult} from "./replace-many";

export interface ReplaceSelect {
    replaceSelect<
        QueryT extends QueryBaseUtil.AfterSelectClause & QueryBaseUtil.NonCorrelated,
        TableT extends InsertableTable & DeletableTable
    > (
        query : QueryT,
        table : TableT,
        row : InsertSelectRow<QueryT, TableT>
    ) : Promise<ReplaceManyResult>;
}

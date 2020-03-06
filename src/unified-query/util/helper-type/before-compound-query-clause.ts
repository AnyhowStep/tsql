import {QueryBaseUtil} from "../../../query-base";
import {IQuery} from "../../query";

export interface BeforeCompoundQueryClause extends
    QueryBaseUtil.BeforeCompoundQueryClause,
    IQuery<QueryBaseUtil.BeforeCompoundQueryClauseData>
{

}

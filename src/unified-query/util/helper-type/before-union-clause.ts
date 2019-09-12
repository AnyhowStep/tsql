import {QueryBaseUtil} from "../../../query-base";
import {IQuery} from "../../query";

export type BeforeCompoundQueryClause = (
    & QueryBaseUtil.BeforeCompoundQueryClause
    & IQuery
);

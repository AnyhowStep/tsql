import {QueryBaseUtil} from "../../../query-base";
import {IQuery} from "../../query";

export type Correlated = (
    & QueryBaseUtil.Correlated
    & IQuery
);

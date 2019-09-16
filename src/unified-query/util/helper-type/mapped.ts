import {QueryBaseUtil} from "../../../query-base";
import {IQuery} from "../../query";

export type Mapped = (
    & QueryBaseUtil.Mapped
    & IQuery
);

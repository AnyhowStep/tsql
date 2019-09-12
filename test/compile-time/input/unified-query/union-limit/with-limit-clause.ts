import * as tsql from "../../../../../dist";

export const query = tsql.QueryUtil.newInstance()
    .compoundQueryLimit(90010n)
    .unionOffset(420n)
    .compoundQueryLimit(13370n);

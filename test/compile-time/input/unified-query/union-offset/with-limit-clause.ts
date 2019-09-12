import * as tsql from "../../../../../dist";

export const query = tsql.QueryUtil.newInstance()
    .unionOffset(90010n)
    .compoundQueryLimit(420n)
    .unionOffset(13370n);

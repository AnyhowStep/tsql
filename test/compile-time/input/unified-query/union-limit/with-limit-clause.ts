import * as tsql from "../../../../../dist";

export const query = tsql.QueryUtil.newInstance()
    .compoundQueryLimit(90010n)
    .compoundQueryOffset(420n)
    .compoundQueryLimit(13370n);

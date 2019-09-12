import * as tsql from "../../../../../dist";

export const query = tsql.QueryUtil.newInstance()
    .compoundQueryLimit(90010n);

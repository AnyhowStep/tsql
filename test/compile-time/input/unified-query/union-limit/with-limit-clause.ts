import * as tsql from "../../../../../dist";

export const query = tsql.QueryUtil.newInstance()
    .unionLimit(90010n)
    .unionOffset(420n)
    .unionLimit(13370n);

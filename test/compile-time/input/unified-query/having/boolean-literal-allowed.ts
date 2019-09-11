import * as tsql from "../../../../../dist";

export const query = tsql.QueryUtil.newInstance()
    .having(() => true)
    .having(() => false)
    .having(() => Math.random() > 0.5);

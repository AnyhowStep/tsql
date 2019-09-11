import * as tsql from "../../../../../dist";

export const query = tsql.QueryUtil.newInstance()
    .where(() => true)
    .where(() => false)
    .where(() => Math.random() > 0.5);

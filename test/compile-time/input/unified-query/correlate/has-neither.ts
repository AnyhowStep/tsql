import * as tsql from "../../../../../dist";

export const correlated = tsql.QueryUtil
    .newInstance()
    .correlate();

import * as tsql from "../../../../../dist";

export const query = tsql.QueryUtil.newInstance()
    .having(() => tsql.and(
        true,
        false
    ));

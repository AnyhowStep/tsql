import * as tsql from "../../../../../dist";

export const query = tsql.QueryUtil.newInstance()
    .where(() => tsql.and3(
        null,
        false
    ));

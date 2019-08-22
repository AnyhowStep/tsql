import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../dist";

const otherTable = tsql.table("otherTable")
    .addColumns({
        otherTableId : tm.mysql.bigIntSigned(),
        createdAt : tm.mysql.dateTime(),
    });

tsql.FromClauseUtil.innerJoin(
    tsql.FromClauseUtil.newInstance(),
    otherTable,
    () => true
);

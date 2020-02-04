import * as tm from "type-mapping";
import * as tape from "tape";
import * as tsql from "../../../../../../dist";
import {compareSqlPretty} from "../../../../../compare-sql-pretty";

tape(__filename, t => {
    const myTable = tsql.table("myTable")
        .addColumns({
            myColumn : tm.mysql.varChar(),
        });
    /**
     * `toSqlPretty()` needs to be updated to be configurable.
     * Has to allow config for string escape styles.
     * Right now, it only has c-style escapes.
     * We need to add pascal-style escapes.
     */
    const expr = tsql.and(
        tsql.like(
            myTable.columns.myColumn,
            tsql.escapeLikePattern("%D\\_v\\_d%", "\\"),
            "\\"
        ),
        tsql.gt(32, 12)
    );

    compareSqlPretty(__filename, t, expr.ast);

    t.end();
});

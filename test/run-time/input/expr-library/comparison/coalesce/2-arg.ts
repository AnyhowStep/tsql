import * as tape from "tape";
import * as tsql from "../../../../../../dist";
import {compareSqlPretty} from "../../../../../compare-sql-pretty";

tape(__filename, t => {
    const expr = tsql.coalesce(false, false);

    compareSqlPretty(__filename, t, expr.ast);

    t.end();
});

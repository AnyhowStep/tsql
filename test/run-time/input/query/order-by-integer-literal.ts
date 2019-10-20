import * as tape from "tape";
import * as tsql from "../../../../dist";
import {compareSqlPretty} from "../../../compare-sql-pretty";

tape(__filename, t => {
    const query = tsql.select(() => [tsql.double.pi().as("pi")])
        .orderBy(() => [
            tsql.ExprUtil.fromRawExpr(BigInt(1))
        ]);

    compareSqlPretty(__filename, t, query);

    t.end();
});

import * as tape from "tape";
import * as tsql from "../../../../../../dist";

tape(__filename, t => {
    const expr = tsql.add();
    t.deepEqual(
        tsql.AstUtil.toSql(expr.ast, tsql.defaultSqlfier),
        `0`
    );

    t.end();
});

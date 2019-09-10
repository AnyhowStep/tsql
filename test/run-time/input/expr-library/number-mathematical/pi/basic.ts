import * as tape from "tape";
import * as tsql from "../../../../../../dist";

tape(__filename, t => {
    const expr = tsql.pi();
    t.deepEqual(
        tsql.AstUtil.toSql(expr.ast, tsql.defaultSqlfier),
        `PI()`
    );

    t.end();
});

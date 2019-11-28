import * as tape from "tape";
//import * as tm from "type-mapping";
import * as tsql from "../../../../../dist";

tape(__filename, t => {
    t.true(
        tsql.BuiltInValueExprArrayUtil.isBuiltInValueExprArray(
            []
        )
    );

    t.end();
});

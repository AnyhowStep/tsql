import * as tape from "tape";
//import * as tm from "type-mapping";
import * as tsql from "../../../../../dist";

tape(__filename, t => {
    t.deepEqual(
        tsql.RawExprUtil.buildAst(
            {
                mapper : () => null,
                tableAlias : "",
                alias : "",
                usedRef : tsql.UsedRefUtil.fromColumnRef({}),
                unaliasedAst : "hi",
            }
        ),
        "hi"
    );
    t.deepEqual(
        {
            ...tsql.RawExprUtil.buildAst(
                {
                    mapper : () => null,
                    tableAlias : "",
                    alias : "",
                    usedRef : tsql.UsedRefUtil.fromColumnRef({}),
                    unaliasedAst : ["a", "b"],
                }
            ) as any,
            toSql : undefined,
        },
        {
            ...new tsql.Parentheses(["a", "b"], true),
            toSql : undefined,
        }
    );
    t.end();
});

import * as tape from "tape";
//import * as tm from "type-mapping";
import * as tsql from "../../../../../dist";

tape(__filename, t => {
    t.throws(() => {
        tsql.BuiltInExprUtil.assertNonNull(`x`, null);
    });

    t.doesNotThrow(() => {
        /**
         * @todo Maybe rename to `assertNonNullable`?
         */
        tsql.BuiltInExprUtil.assertNonNull(`x`, tsql.coalesce(null, 1));
    });

    t.throws(() => {
        tsql.BuiltInExprUtil.assertNonNull(`x`, tsql.if(true, null as 1|null, 1));
    });

    t.throws(() => {
        tsql.BuiltInExprUtil.assertNonNull(`x`, tsql.nullIf(1, 2));
    });

    t.throws(() => {
        tsql.BuiltInExprUtil.assertNonNull(`x`, tsql.nullIf(1, 1));
    });

    t.doesNotThrow(() => {
        tsql.BuiltInExprUtil.assertNonNull(`x`, tsql.ifNull(1, 2));
    });

    t.doesNotThrow(() => {
        tsql.BuiltInExprUtil.assertNonNull(`x`, tsql.ifNull(null as null|number, 2));
    });

    t.throws(() => {
        tsql.BuiltInExprUtil.assertNonNull(`x`, tsql.ifNull(null, null));
    });

    t.throws(() => {
        tsql.BuiltInExprUtil.assertNonNull(`x`, tsql.ifNull(tsql.if(true, 1, null), null));
    });

    t.throws(() => {
        tsql.BuiltInExprUtil.assertNonNull(`x`, tsql.groupConcatDistinct("hi"));
    });

    t.throws(() => {
        tsql.BuiltInExprUtil.assertNonNull(`x`, tsql.groupConcatAll("hi", ","));
    });

    t.end();
});

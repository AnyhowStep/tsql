import * as tm from "type-mapping";
import * as tape from "tape";
import * as tsql from "../../../../../../../dist";

tape(__filename, async (t) => {
    t.deepEqual(
        (
            tsql.BuiltInExprUtil.fromValueExpr(
                tsql.dtVarChar(),
                "" as any
            )
        ),
        ""
    );
    t.deepEqual(
        (
            tsql.BuiltInExprUtil.fromValueExpr(
                tsql.dtVarChar(),
                "a" as any
            )
        ),
        "a"
    );
    t.deepEqual(
        (
            tsql.BuiltInExprUtil.fromValueExpr(
                tsql.dtVarChar(),
                "ab" as any
            )
        ),
        "ab"
    );
    t.deepEqual(
        (
            tsql.BuiltInExprUtil.fromValueExpr(
                tsql.dtVarChar(),
                "abc" as any
            )
        ),
        "abc"
    );
    t.deepEqual(
        (
            tsql.BuiltInExprUtil.fromValueExpr(
                tsql.dtVarChar(),
                "z".repeat(65535) as any
            )
        ),
        "z".repeat(65535)
    );

    try {
        tsql.BuiltInExprUtil.fromValueExpr(
            tsql.dtVarChar(),
            "z".repeat(65535+1) as any
        );
        t.fail("Should fail");
    } catch (err) {
        const expectedMeta = (err as tm.MappingError).expectedMeta!;
        t.deepEqual(
            expectedMeta.errorCode,
            "EXPECTED_LENGTH"
        );
        t.deepEqual(
            expectedMeta.min,
            undefined
        );
        t.deepEqual(
            expectedMeta.max,
            65535
        );
    }

    t.end();
});

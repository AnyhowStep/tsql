import * as tm from "type-mapping";
import * as tape from "tape";
import * as tsql from "../../../../../../../dist";

tape(__filename, async (t) => {
    t.deepEqual(
        (
            tsql.BuiltInExprUtil.fromValueExpr(
                tsql.dtVarChar(3),
                "" as any
            )
        ),
        ""
    );
    t.deepEqual(
        (
            tsql.BuiltInExprUtil.fromValueExpr(
                tsql.dtVarChar(3),
                "a" as any
            )
        ),
        "a"
    );
    t.deepEqual(
        (
            tsql.BuiltInExprUtil.fromValueExpr(
                tsql.dtVarChar(3),
                "ab" as any
            )
        ),
        "ab"
    );
    t.deepEqual(
        (
            tsql.BuiltInExprUtil.fromValueExpr(
                tsql.dtVarChar(3),
                "abc" as any
            )
        ),
        "abc"
    );

    try {
        tsql.BuiltInExprUtil.fromValueExpr(
            tsql.dtVarChar(3),
            "abcd" as any
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
            3
        );
    }

    t.end();
});

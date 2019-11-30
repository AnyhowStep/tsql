import * as tm from "type-mapping";
import * as tape from "tape";
import * as tsql from "../../../../../../../dist";

tape(__filename, async (t) => {
    t.deepEqual(
        (
            tsql.BuiltInExprUtil.fromValueExpr(
                tsql.dtVarChar(3, tm.subStringBlacklist(["*"])),
                "" as any
            )
        ),
        ""
    );
    t.deepEqual(
        (
            tsql.BuiltInExprUtil.fromValueExpr(
                tsql.dtVarChar(3, tm.subStringBlacklist(["*"])),
                "a" as any
            )
        ),
        "a"
    );
    t.deepEqual(
        (
            tsql.BuiltInExprUtil.fromValueExpr(
                tsql.dtVarChar(3, tm.subStringBlacklist(["*"])),
                "ab" as any
            )
        ),
        "ab"
    );
    t.deepEqual(
        (
            tsql.BuiltInExprUtil.fromValueExpr(
                tsql.dtVarChar(3, tm.subStringBlacklist(["*"])),
                "abc" as any
            )
        ),
        "abc"
    );

    try {
        tsql.BuiltInExprUtil.fromValueExpr(
            tsql.dtVarChar(3, tm.subStringBlacklist(["*"])),
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

    try {
        tsql.BuiltInExprUtil.fromValueExpr(
            tsql.dtVarChar(3, tm.subStringBlacklist(["*"])),
            "*" as any
        );
        t.fail("Should fail");
    } catch (err) {
        const expected = (err as tm.MappingError).expected!;
        t.deepEqual(
            expected,
            `not "*"`
        );
    }

    try {
        tsql.BuiltInExprUtil.fromValueExpr(
            tsql.dtVarChar(3, tm.subStringBlacklist(["*"])),
            "a**" as any
        );
        t.fail("Should fail");
    } catch (err) {
        const expected = (err as tm.MappingError).expected!;
        t.deepEqual(
            expected,
            `not "*"`
        );
    }

    t.end();
});

import * as tm from "type-mapping";
import * as tape from "tape";
import * as tsql from "../../../../../../../dist";

tape(__filename, async (t) => {

    try {
        tsql.DataTypeUtil.toBuiltInExpr_NonCorrelated(
            tsql.dtVarChar(2, 5),
            "" as any
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
            2
        );
        t.deepEqual(
            expectedMeta.max,
            5
        );
    }
    try {
        tsql.DataTypeUtil.toBuiltInExpr_NonCorrelated(
            tsql.dtVarChar(2, 5),
            "a" as any
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
            2
        );
        t.deepEqual(
            expectedMeta.max,
            5
        );
    }
    t.deepEqual(
        (
            tsql.DataTypeUtil.toBuiltInExpr_NonCorrelated(
                tsql.dtVarChar(2, 5),
                "ab" as any
            )
        ),
        "ab"
    );
    t.deepEqual(
        (
            tsql.DataTypeUtil.toBuiltInExpr_NonCorrelated(
                tsql.dtVarChar(2, 5),
                "abc" as any
            )
        ),
        "abc"
    );
    t.deepEqual(
        (
            tsql.DataTypeUtil.toBuiltInExpr_NonCorrelated(
                tsql.dtVarChar(2, 5),
                "abcd" as any
            )
        ),
        "abcd"
    );
    t.deepEqual(
        (
            tsql.DataTypeUtil.toBuiltInExpr_NonCorrelated(
                tsql.dtVarChar(2, 5),
                "abcde" as any
            )
        ),
        "abcde"
    );

    try {
        tsql.DataTypeUtil.toBuiltInExpr_NonCorrelated(
            tsql.dtVarChar(2, 5),
            "abcdef" as any
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
            2
        );
        t.deepEqual(
            expectedMeta.max,
            5
        );
    }

    t.end();
});

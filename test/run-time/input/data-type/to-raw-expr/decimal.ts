import * as tm from "type-mapping";
import * as tape from "tape";
import * as tsql from "../../../../../dist";

tape(__filename, async (t) => {
    t.deepEqual(
        (
            tsql.DataTypeUtil.toBuiltInExpr_NonCorrelated(
                tsql.dtDecimal(10, 5),
                "123.456" as any
            ) as tsql.IExpr
        ).ast,
        {
            type : "LiteralValue",
            literalValueType : tsql.LiteralValueType.DECIMAL,
            literalValue : "123.456",
            precision : BigInt(10),
            scale : BigInt(5),
        }
    );

    t.deepEqual(
        (
            tsql.DataTypeUtil.toBuiltInExpr_NonCorrelated(
                tsql.dtDecimal(10, 5),
                "123.456e-1" as any
            ) as tsql.IExpr
        ).ast,
        {
            type : "LiteralValue",
            literalValueType : tsql.LiteralValueType.DECIMAL,
            literalValue : "12.3456",
            precision : BigInt(10),
            scale : BigInt(5),
        }
    );

    t.deepEqual(
        (
            tsql.DataTypeUtil.toBuiltInExpr_NonCorrelated(
                tsql.dtDecimal(10, 5),
                "123.456e-2" as any
            ) as tsql.IExpr
        ).ast,
        {
            type : "LiteralValue",
            literalValueType : tsql.LiteralValueType.DECIMAL,
            literalValue : "1.23456",
            precision : BigInt(10),
            scale : BigInt(5),
        }
    );

    t.deepEqual(
        (
            tsql.DataTypeUtil.toBuiltInExpr_NonCorrelated(
                tsql.dtDecimal(10, 5),
                "123.456e+2" as any
            ) as tsql.IExpr
        ).ast,
        {
            type : "LiteralValue",
            literalValueType : tsql.LiteralValueType.DECIMAL,
            literalValue : "12345.6",
            precision : BigInt(10),
            scale : BigInt(5),
        }
    );

    t.deepEqual(
        (
            tsql.DataTypeUtil.toBuiltInExpr_NonCorrelated(
                tsql.dtDecimal(10, 5),
                "123.4567891e+2" as any
            ) as tsql.IExpr
        ).ast,
        {
            type : "LiteralValue",
            literalValueType : tsql.LiteralValueType.DECIMAL,
            literalValue : "12345.67891",
            precision : BigInt(10),
            scale : BigInt(5),
        }
    );

    try {
        tsql.DataTypeUtil.toBuiltInExpr_NonCorrelated(
            tsql.dtDecimal(10, 5),
            "123.456e-3" as any
        );
        t.fail("Should fail");
    } catch (err) {
        const expectedMeta = (err as tm.MappingError).expectedMeta!;
        t.deepEqual(
            expectedMeta.errorCode,
            "EXPECTED_DECIMAL_SCALE_LESS_THAN_OR_EQUAL_TO"
        );
        t.deepEqual(
            expectedMeta.curScale,
            6
        );
    }

    try {
        tsql.DataTypeUtil.toBuiltInExpr_NonCorrelated(
            tsql.dtDecimal(10, 5),
            "123450.67891" as any
        );
        t.fail("Should fail");
    } catch (err) {
        const expectedMeta = (err as tm.MappingError).expectedMeta!;
        t.deepEqual(
            expectedMeta.errorCode,
            "EXPECTED_DECIMAL_PRECISION_LESS_THAN_OR_EQUAL_TO"
        );
        t.deepEqual(
            expectedMeta.curPrecision,
            11
        );
    }

    t.end();
});

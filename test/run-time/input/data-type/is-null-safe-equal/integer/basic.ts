import * as tape from "tape";
import * as tsql from "../../../../../../dist";

tape(__filename, async (t) => {
    t.true(
        tsql.DataTypeUtil.isNullSafeEqual(
            tsql.dtBigIntSigned(),
            BigInt(0),
            BigInt(0)
        )
    );
    t.true(
        tsql.DataTypeUtil.isNullSafeEqual(
            tsql.dtBigIntSigned(),
            BigInt(32),
            BigInt(32)
        )
    );
    t.true(
        tsql.DataTypeUtil.isNullSafeEqual(
            tsql.dtBigIntSigned(),
            BigInt(-32),
            BigInt(-32)
        )
    );
    t.false(
        tsql.DataTypeUtil.isNullSafeEqual(
            tsql.dtBigIntSigned(),
            BigInt(32),
            BigInt(-32)
        )
    );
    t.false(
        tsql.DataTypeUtil.isNullSafeEqual(
            tsql.dtBigIntSigned(),
            BigInt(0),
            BigInt(-1)
        )
    );

    t.end();
});

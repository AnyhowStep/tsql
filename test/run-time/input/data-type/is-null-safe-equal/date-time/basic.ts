import * as tape from "tape";
import * as tsql from "../../../../../../dist";

tape(__filename, async (t) => {
    t.true(
        tsql.DataTypeUtil.isNullSafeEqual(
            tsql.dtDateTime(3),
            new Date(0),
            new Date(0)
        )
    );
    t.true(
        tsql.DataTypeUtil.isNullSafeEqual(
            tsql.dtDateTime(3),
            new Date(32),
            new Date(32)
        )
    );
    t.true(
        tsql.DataTypeUtil.isNullSafeEqual(
            tsql.dtDateTime(3),
            new Date(-32),
            new Date(-32)
        )
    );
    t.false(
        tsql.DataTypeUtil.isNullSafeEqual(
            tsql.dtDateTime(3),
            new Date(32),
            new Date(-32)
        )
    );
    t.false(
        tsql.DataTypeUtil.isNullSafeEqual(
            tsql.dtDateTime(3),
            new Date(0),
            new Date(-1)
        )
    );

    t.end();
});

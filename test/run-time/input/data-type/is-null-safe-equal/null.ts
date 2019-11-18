import * as tape from "tape";
import * as tsql from "../../../../../dist";

tape(__filename, async (t) => {
    t.true(
        tsql.DataTypeUtil.isNullSafeEqual(
            tsql.dtDouble().orNull(),
            null,
            null
        )
    );
    t.false(
        tsql.DataTypeUtil.isNullSafeEqual(
            tsql.dtDouble().orNull(),
            1,
            null
        )
    );
    t.false(
        tsql.DataTypeUtil.isNullSafeEqual(
            tsql.dtDouble().orNull(),
            null,
            1
        )
    );

    t.end();
});

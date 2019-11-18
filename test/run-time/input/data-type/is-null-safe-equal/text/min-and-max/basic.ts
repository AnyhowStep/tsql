import * as tape from "tape";
import * as tsql from "../../../../../../../dist";

tape(__filename, async (t) => {
    t.true(
        tsql.DataTypeUtil.isNullSafeEqual(
            tsql.dtVarChar(2, 5),
            "ab",
            "ab"
        )
    );
    t.true(
        tsql.DataTypeUtil.isNullSafeEqual(
            tsql.dtVarChar(2, 5),
            "abcde",
            "abcde"
        )
    );
    t.false(
        tsql.DataTypeUtil.isNullSafeEqual(
            tsql.dtVarChar(2, 5),
            "ab",
            "abc"
        )
    );
    t.false(
        tsql.DataTypeUtil.isNullSafeEqual(
            tsql.dtVarChar(2, 5),
            "aaaba",
            "aaaaa"
        )
    );

    t.end();
});

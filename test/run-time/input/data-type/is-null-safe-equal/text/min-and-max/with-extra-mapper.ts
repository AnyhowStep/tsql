import * as tm from "type-mapping";
import * as tape from "tape";
import * as tsql from "../../../../../../../dist";

tape(__filename, async (t) => {
    t.true(
        tsql.DataTypeUtil.isNullSafeEqual(
            tsql.dtVarChar(2, 5, tm.subStringBlacklist(["*"])),
            "ab",
            "ab"
        )
    );
    t.true(
        tsql.DataTypeUtil.isNullSafeEqual(
            tsql.dtVarChar(2, 5, tm.subStringBlacklist(["*"])),
            "abcde",
            "abcde"
        )
    );
    t.false(
        tsql.DataTypeUtil.isNullSafeEqual(
            tsql.dtVarChar(2, 5, tm.subStringBlacklist(["*"])),
            "ab",
            "abc"
        )
    );
    t.false(
        tsql.DataTypeUtil.isNullSafeEqual(
            tsql.dtVarChar(2, 5, tm.subStringBlacklist(["*"])),
            "aaaba",
            "aaaaa"
        )
    );

    t.end();
});

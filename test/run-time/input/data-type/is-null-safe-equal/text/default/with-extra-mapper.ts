import * as tm from "type-mapping";
import * as tape from "tape";
import * as tsql from "../../../../../../../dist";

tape(__filename, async (t) => {
    t.true(
        tsql.DataTypeUtil.isNullSafeEqual(
            tsql.dtVarChar(tm.subStringBlacklist(["*"])),
            "",
            ""
        )
    );
    t.true(
        tsql.DataTypeUtil.isNullSafeEqual(
            tsql.dtVarChar(tm.subStringBlacklist(["*"])),
            "ab",
            "ab"
        )
    );
    t.false(
        tsql.DataTypeUtil.isNullSafeEqual(
            tsql.dtVarChar(tm.subStringBlacklist(["*"])),
            "a",
            ""
        )
    );
    t.false(
        tsql.DataTypeUtil.isNullSafeEqual(
            tsql.dtVarChar(tm.subStringBlacklist(["*"])),
            "a",
            "b"
        )
    );

    t.end();
});

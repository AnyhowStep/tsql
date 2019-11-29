import * as tape from "tape";
import * as tsql from "../../../../../dist";

tape(__filename, async (t) => {
    t.false(
        tsql.DataTypeUtil.isDataType({
            toBuiltInExpr_NonCorrelated : () => 1,
            isNullSafeEqual : () => false,
        })
    );

    t.end();
});

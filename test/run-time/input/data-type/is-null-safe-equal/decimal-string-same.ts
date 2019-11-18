import * as tape from "tape";
import * as tsql from "../../../../../dist";

tape(__filename, async (t) => {
    t.true(
        tsql.DataTypeUtil.isNullSafeEqual(
            tsql.dtDecimal(65, 10),
            "123.456" as { toString () : string } as tsql.Decimal,
            "123.456" as { toString () : string } as tsql.Decimal
        )
    );

    t.end();
});

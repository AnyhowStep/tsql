import * as tape from "tape";
import * as tsql from "../../../../../dist";

tape(__filename, async (t) => {
    t.true(
        tsql.DataTypeUtil.isNullSafeEqual(
            tsql.dtDecimal(65, 10),
            { toString : () => "1234.56e-1" } as tsql.Decimal,
            { toString : () => "123.456" } as tsql.Decimal
        )
    );
    t.true(
        tsql.DataTypeUtil.isNullSafeEqual(
            tsql.dtDecimal(65, 10),
            { toString : () => "1234.56e-1" } as tsql.Decimal,
            { toString : () => "12.3456e1" } as tsql.Decimal
        )
    );

    t.end();
});

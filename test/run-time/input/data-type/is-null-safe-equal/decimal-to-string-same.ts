import * as tape from "tape";
import * as tsql from "../../../../../dist";

tape(__filename, async (t) => {
    t.true(
        tsql.DataTypeUtil.isNullSafeEqual(
            tsql.dtDecimal(65, 10),
            { toString : () => "123.456" } as tsql.Decimal,
            { toString : () => "123.456" } as tsql.Decimal
        )
    );
    t.true(
        tsql.DataTypeUtil.isNullSafeEqual(
            tsql.dtDecimal(65, 10),
            { toString : () => "+0" } as tsql.Decimal,
            { toString : () => "-0" } as tsql.Decimal
        )
    );
    t.true(
        tsql.DataTypeUtil.isNullSafeEqual(
            tsql.dtDecimal(65, 10),
            { toString : () => "0" } as tsql.Decimal,
            { toString : () => "-0" } as tsql.Decimal
        )
    );

    t.end();
});

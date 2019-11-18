import * as tape from "tape";
import * as tsql from "../../../../../dist";

tape(__filename, async (t) => {
    t.throws(() => {
        tsql.DataTypeUtil.isNullSafeEqual(
            tsql.dtDecimal(65, 10),
            { toString : () => "123. 456" } as tsql.Decimal,
            { toString : () => "123.456" } as tsql.Decimal
        )
    });

    t.throws(() => {
        tsql.DataTypeUtil.isNullSafeEqual(
            tsql.dtDecimal(65, 10),
            { toString : () => "123.456" } as tsql.Decimal,
            { toString : () => "123 .456" } as tsql.Decimal
        )
    });
    t.throws(() => {
        tsql.DataTypeUtil.isNullSafeEqual(
            tsql.dtDecimal(65, 10),
            { toString : () => "123. 456" } as tsql.Decimal,
            { toString : () => "123 .456" } as tsql.Decimal
        )
    });

    t.end();
});

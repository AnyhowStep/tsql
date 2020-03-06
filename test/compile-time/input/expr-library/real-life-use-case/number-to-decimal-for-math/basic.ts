import * as tm from "type-mapping";
import * as tsql from "../../../../../../dist";

const numberTable = tsql.table("numberTable")
    .addColumns({
        ratio : tm.mysql.double(),
        baseAmount : tm.mysql.double(),
        otherBaseAmount : tm.mysql.bigIntSigned(),
    });

/**
 * Similar situation encountered for money-related calculations.
 */
export const payInMethodTypeFeeAmount = tsql.unsafeCastAsBigIntSigned(
    tsql.decimal.ceiling(
        tsql.decimal.mul(
            tsql.unsafeCastAsDecimal(numberTable.columns.ratio, 65, 30),
            tsql.decimal.add(
                tsql.unsafeCastAsDecimal(numberTable.columns.baseAmount, 65, 30),
                tsql.unsafeCastAsDecimal(numberTable.columns.otherBaseAmount, 65, 30)
            )
        )
    )
);

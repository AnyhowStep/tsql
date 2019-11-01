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
export const payInMethodTypeFeeAmount = tsql.castAsSignedBigInteger(
    tsql.decimal.ceiling(
        tsql.decimal.mul(
            tsql.castAsDecimal(numberTable.columns.ratio, 65, 30),
            tsql.decimal.add(
                tsql.castAsDecimal(numberTable.columns.baseAmount, 65, 30),
                tsql.castAsDecimal(numberTable.columns.otherBaseAmount, 65, 30)
            )
        )
    )
);

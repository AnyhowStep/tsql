import * as tsql from "../../../../../dist";

export const expr = tsql.integer.add(
    tsql.selectValue(() => tsql.integer.add(BigInt(1))),
    BigInt(2)
);;

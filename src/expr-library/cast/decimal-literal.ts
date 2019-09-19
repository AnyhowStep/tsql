import * as tm from "type-mapping";
import {Decimal} from "../../decimal";
import {IUsedRef} from "../../used-ref";
import {Expr} from "../../expr";
import {castAsDecimal} from "./cast-as-decimal";

export function decimalLiteral (
    rawDecimalLiteral : string|number|bigint|Decimal,
    /**
     * + MySQL's max precision is `65`
     * + PostgreSQL's min precision is `1`
     */
    precision : number|bigint,
    /**
     * + MySQL's max scale is `30`.
     * + The min scale is `0`.
     * + `scale` must be <= `precision`.
     */
    scale : number|bigint
) : (
    Expr<{
        mapper : tm.SafeMapper<Decimal|null>,
        usedRef : IUsedRef<{}>,
    }>
) {
    const mapper = tm.mysql.decimal();
    return castAsDecimal(
        mapper("rawDecimalLiteral", rawDecimalLiteral).toString(),
        precision,
        scale
    );
}

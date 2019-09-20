import * as tm from "type-mapping";
import {Decimal} from "../../../../decimal";
import {DecimalLiteralNode, LiteralValueType} from "../../literal-value-node";
import * as ExprLib from "../../../../expr-library";

export function decimalLiteralNode (
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
) : DecimalLiteralNode {
    const mapper = tm.mysql.decimal();

    const decimalDefinition = ExprLib.assertValidDecimalPrecisionAndScale(precision, scale);
    const literalValue = mapper("rawDecimalLiteral", rawDecimalLiteral).toString();

    return {
        type : "LiteralValue",
        literalValueType : LiteralValueType.DECIMAL,
        literalValue,
        precision : decimalDefinition.precision,
        scale : decimalDefinition.scale,
    };
}

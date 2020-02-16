import {LiteralValueType, DoubleLiteralNode} from "../../literal-value-node";

export function doubleLiteralNode (
    literalValue : number
) : DoubleLiteralNode {
    /**
     * The SQL standard forbids NaN, Infinity, -Infinity.
     * However, SQLite supports infinities.
     *
     * The job of throwing on these 3 values will have to
     * fall to the sqlfiers.
     */
    /*
    if (!isFinite(literalValue)) {
        throw new Error(`Double literal must be finite`);
    }
    */
    return {
        type : "LiteralValue",
        literalValueType : LiteralValueType.DOUBLE,
        literalValue,
    };
}

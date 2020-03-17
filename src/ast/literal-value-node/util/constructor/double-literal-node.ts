import {LiteralValueType, DoubleLiteralNode} from "../../literal-value-node";

export function doubleLiteralNode (
    literalValue : number
) : DoubleLiteralNode {
    /**
     * SQLite and PostgreSQL support infinities; MySQL does not.
     *
     * PostgreSQL supports `NaN`; SQLite and MySQL use `null` for `NaN`.
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

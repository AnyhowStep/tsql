import {Parentheses} from "./parentheses";
import {FunctionCall} from "./function-call";
import {OperatorNode} from "./operator-node";
import {IdentifierNode} from "./identifier-node";
import {IQueryBase} from "../query-base";
import {LiteralValueNode} from "./literal-value-node";
import {CaseNode} from "./case-node";
import {CaseWhenNode} from "./case-when-node";

export interface AstArray extends ReadonlyArray<Ast> {
}
export type Ast =
    /**
     * A string literal that will not be escaped
     */
    | string
    /**
     * An array of AST
     */
    | AstArray
    /**
     * Adds parentheses around an AST
     */
    | Parentheses
    /**
     * @todo Description
     */
    | FunctionCall
    /**
     * @todo Description
     */
    | OperatorNode
    /**
     * @todo Description
     */
    | IdentifierNode
    /**
     * A literal value, it **MUST** have its value **ESCAPED** before being passed to the DBMS!
     */
    | LiteralValueNode
    /**
     * A query
     */
    | IQueryBase
    /**
     * Similar to switch-statements in other languages.
     */
    | CaseNode
    /**
     * Similar to if-statements in other languages.
     */
    | CaseWhenNode
;

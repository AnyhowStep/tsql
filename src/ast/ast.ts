import {Parentheses} from "./parentheses";
import {FunctionCall} from "./function-call";

export interface AstArray extends ReadonlyArray<Ast> {
}
export type Ast = (
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
);
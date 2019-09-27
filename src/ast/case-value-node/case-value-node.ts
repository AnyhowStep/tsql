import {Ast} from "../ast";

/**
 * The first `Ast` is the `compare_value`.
 * The second `Ast` is the `result`.
 */
export type Case = readonly [Ast, Ast];

/**
 * Similar to switch-statements in other languages.
 */
export interface CaseValueNode {
    readonly type : "CaseValue",
    /**
     * The `value` to test against.
     */
    readonly value : Ast,
    /**
     * A `CASE` expression must have at least one case.
     */
    readonly cases : readonly [Case, ...Case[]],
    /**
     * A `CASE` expression may have an `ELSE` clause.
     */
    readonly else : Ast|undefined,
}

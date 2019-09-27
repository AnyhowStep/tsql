import {Ast} from "../ast";

/**
 * The first `Ast` is the `condition`.
 * The second `Ast` is the `result`.
 */
export type Branch = readonly [Ast, Ast];

/**
 * Similar to if-statements in other languages.
 */
export interface CaseConditionNode {
    readonly type : "CaseCondition",
    /**
     * A `CASE WHEN` expression must have at least one branch.
     */
    readonly branches : readonly [Branch, ...Branch[]],
    /**
     * A `CASE WHEN` expression may have an `ELSE` clause.
     */
    readonly else : Ast|undefined,
}

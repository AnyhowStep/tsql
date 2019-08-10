import * as tm from "type-mapping";
import {RawExpr, RawExprUtil} from "../../../raw-expr";
import {Expr, ExprUtil, expr} from "../../../expr";
import {Parentheses} from "../../../ast";

/**
 * https://dev.mysql.com/doc/refman/8.0/en/logical-operators.html#operator_not
 *
 * This version of the `NOT` operator allows `NULL`.
 *
 * For two-valued logic, @see {@link not}
 */
export function not3<RawExprT extends RawExpr<boolean|null>> (
    rawExpr : RawExprT
) : (
    Expr<{
        mapper : tm.SafeMapper<boolean|null>,
        usedRef : RawExprUtil.UsedRef<RawExprT>,
    }>
) {
    if (rawExpr === true) {
        //NOT TRUE === FALSE
        return ExprUtil.fromRawExpr(false) as any;
    }
    if (rawExpr === false) {
        //NOT FALSE === TRUE
        return ExprUtil.fromRawExpr(true) as any;
    }
    if (rawExpr === null) {
        //NOT NULL === NULL
        return ExprUtil.fromRawExpr(null) as any;
    }

    if (ExprUtil.isExpr(rawExpr)) {
        if (rawExpr.ast instanceof Parentheses) {
            const tree = rawExpr.ast.ast;
            if (tree instanceof Array && tree.length == 2) {
                if (tree[0] === "NOT") {
                    //NOT (NOT (expr)) === expr
                    return expr(
                        {
                            mapper : tm.mysql.boolean().orNull(),
                            usedRef : RawExprUtil.usedRef(rawExpr),
                        },
                        tree[1]
                    ) as any;
                }

            }
        } else if (rawExpr.ast == RawExprUtil.buildAst(true)) {
            //NOT TRUE === FALSE
            return ExprUtil.fromRawExpr(false) as any;
        } else if (rawExpr.ast == RawExprUtil.buildAst(false)) {
            //NOT FALSE === TRUE
            return ExprUtil.fromRawExpr(true) as any;
        } else if (rawExpr.ast == RawExprUtil.buildAst(null)) {
            //NOT NULL === NULL
            return ExprUtil.fromRawExpr(null) as any;
        }
    }
    return expr(
        {
            mapper : tm.mysql.boolean().orNull(),
            usedRef : RawExprUtil.usedRef(rawExpr),
        },
        [
            "NOT",
            RawExprUtil.buildAst(rawExpr)
        ]
    );
}

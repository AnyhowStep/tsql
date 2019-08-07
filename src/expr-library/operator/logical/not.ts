import * as tm from "type-mapping";
import {RawExpr, RawExprUtil} from "../../../raw-expr";
import {Expr, ExprUtil} from "../../../expr";
import {Parentheses} from "../../../ast";

export function not<RawExprT extends RawExpr<boolean>> (
    rawExpr : RawExprT
) : (
    Expr<{
        mapper : tm.SafeMapper<boolean>,
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

    if (ExprUtil.isExpr(rawExpr)) {
        if (rawExpr.ast instanceof Parentheses) {
            const tree = rawExpr.ast.ast;
            if (tree instanceof Array && tree.length == 2) {
                if (tree[0] === "NOT") {
                    //NOT (NOT (expr)) === expr
                    return new Expr(
                        {
                            mapper : tm.mysql.boolean(),
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
        }
    }
    return new Expr(
        {
            mapper : tm.mysql.boolean(),
            usedRef : RawExprUtil.usedRef(rawExpr),
        },
        [
            "NOT",
            RawExprUtil.buildAst(rawExpr)
        ]
    );
}

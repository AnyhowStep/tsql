import {Ast} from "./ast";
import * as AstUtil from "./util";
import {FunctionCall} from "./function-call";
import {Sqlfier} from "./sqlfier";
import {isIdentifierNode} from "./identifier-node";
import {LiteralValueNodeUtil} from "./literal-value-node";

function shouldWrap (ast : Ast, canUnwrap : boolean) : boolean {
    if (Parentheses.IsParentheses(ast)) {
        if (!canUnwrap && ast.canUnwrap) {
            return true;
        } else {
            return false;
        }
    }

    if (FunctionCall.IsFunctionCall(ast)) {
        return false;
    }

    if (LiteralValueNodeUtil.isLiteralValueNode(ast)) {
        return false;
    }

    if (isIdentifierNode(ast)) {
        return false;
    }

    if (typeof ast == "string") {
        return false;
    }

    if (Array.isArray(ast)) {
        if (ast.length == 0) {
            throw new Error(`Attempt to add parentheses around empty query tree`);
        } else if (ast.length == 1) {
            return false;
        } else {
            return true;
        }
    }

    return true;
}

export class Parentheses {
    public readonly type = "Parentheses";
    public readonly ast : Ast;
    /**
     * This,
     * ```sql
     * SELECT
     *  IF(
     *      RAND() > 0.5,
     *      --The parentheses here may be unwrapped safely
     *      (RAND() + 1),
     *      --The parentheses here MAY NOT be unwrapped safely
     *      (SELECT x FROM myTable ORDER BY RAND() LIMIT 1)
     *  )
     * ```
     *
     * Is the same as this,
     * ```sql
     * SELECT
     *  IF(
     *      RAND() > 0.5,
     *      --The parentheses here may be unwrapped safely
     *      RAND() + 1,
     *      --The parentheses here MAY NOT be unwrapped safely
     *      (SELECT x FROM myTable ORDER BY RAND() LIMIT 1)
     *  )
     * ```
     *
     * You cannot unwrap sub-queries or you will get a syntax error.
     */
    public readonly canUnwrap : boolean;

    public constructor (ast : Ast, canUnwrap : boolean) {
        this.ast = ast;
        this.canUnwrap = canUnwrap;
    }
    public toSql = (sqlfier : Sqlfier) : string => {
        /**
         * @todo Investigate this logic
         */
        const sqlAst = AstUtil.toSqlAst(this.ast, sqlfier);
        if (!this.canUnwrap || shouldWrap(sqlAst, this.canUnwrap)) {
            return `(${AstUtil.toSql(sqlAst, sqlfier)})`;
        } else {
            return AstUtil.toSql(sqlAst, sqlfier);
        }
    }

    public static IsParentheses (x : any) : x is Parentheses {
        if (x instanceof Parentheses) {
            return true;
        }
        if (x == undefined) {
            return false;
        }

        const mixed = x as Partial<Parentheses>;
        return (
            (mixed.type == "Parentheses") &&
            /**
             * @todo Debate if this is necessary.
             * Safer, but slower.
             */
            //AstUtil.isAst(mixed.ast) &&
            (typeof mixed.canUnwrap == "boolean") &&
            (typeof mixed.toSql == "function")
        );
    }

    public static Create (ast : Ast, canUnwrap : boolean = true) : Ast {
        if (shouldWrap(ast, canUnwrap)) {
            if (Parentheses.IsParentheses(ast)) {
                return new Parentheses(ast.ast, canUnwrap);
            } else {
                return new Parentheses(ast, canUnwrap);
            }
        } else {
            return ast;
        }
    }
}
export function parentheses (ast : Ast, canUnwrap? : boolean) {
    return Parentheses.Create(ast, canUnwrap);
}

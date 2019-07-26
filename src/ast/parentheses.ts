import {Ast} from "./ast";
import * as AstUtil from "./util";
import {FunctionCall} from "./function-call";

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
    private cachedSql : string|undefined = undefined;
    public toSql = () : string => {
        if (this.cachedSql == undefined) {
            const sql = AstUtil.toSql(this.ast);
            this.cachedSql = `(${sql})`;
        }
        return this.cachedSql;
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
        if (Parentheses.IsParentheses(ast)) {
            //No need to wrap parentheses in parentheses...
            //Unless...
            if (!canUnwrap && ast.canUnwrap) {
                //We don't want this unwrappable paren to be unwrapped...
                return new Parentheses(ast.ast, canUnwrap);
            }
            return ast;
        } else if (FunctionCall.IsFunctionCall(ast)) {
            //We don't need to have parentheses around function calls
            return ast;
        } else if (Array.isArray(ast)) {
            if (ast.length == 0) {
                throw new Error(`Attempt to add parentheses around empty query tree`);
            } else if (ast.length == 1) {
                //No need to wrap parentheses against unit expressions
                return ast;
            } else {
                return new Parentheses(ast, canUnwrap);
            }
        } else if (typeof ast == "string") {
            //No need to wrap parentheses against unit expressions
            return ast;
        } else {
            return new Parentheses(ast, canUnwrap);
        }
    }
}
export function parentheses (ast : Ast, canUnwrap? : boolean) {
    return Parentheses.Create(ast, canUnwrap);
}

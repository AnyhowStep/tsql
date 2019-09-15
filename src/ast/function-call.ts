import {Ast} from "./ast";
import {Parentheses} from "./parentheses";
import * as AstUtil from "./util";
import {Sqlfier} from "./sqlfier";

export class FunctionArg {
    readonly type = "FunctionArg";
    readonly ast : Ast;

    constructor (ast : Ast) {
        if (Parentheses.IsParentheses(ast) && ast.canUnwrap) {
            //No need to wrap arguments in parentheses...
            //Unless the argument is a sub-query...
            this.ast = ast.ast;
        } else {
            this.ast = ast;
        }
    }

    private cachedSql : string|undefined = undefined;
    toSql = (sqlfier : Sqlfier) : string => {
        if (this.cachedSql == undefined) {
            this.cachedSql = AstUtil.toSql(this.ast, sqlfier);
        }
        return this.cachedSql;
    };

    static IsFunctionArg (x : any) : x is FunctionArg {
        if (x instanceof FunctionArg) {
            return true;
        }
        if (x == undefined) {
            return false;
        }

        const mixed = x as Partial<FunctionArg>;
        return (
            (mixed.type == "FunctionArg") &&
            /**
             * @todo Debate if this is necessary.
             * Safer, but slower.
             */
            //AstUtil.isAst(mixed.ast) &&
            (typeof mixed.toSql == "function")
        );
    }
}
export class FunctionCall {
    readonly type = "FunctionCall";
    readonly functionName : string;
    readonly args : readonly FunctionArg[];

    constructor (functionName : string, args : readonly FunctionArg[]) {
        this.functionName = functionName;
        this.args = args;
    }

    private cachedSql : string|undefined = undefined;
    toSql = (sqlfier : Sqlfier) : string => {
        if (this.cachedSql == undefined) {
            const argsSql = this.args
                .map(arg => arg.toSql(sqlfier))
                .join(", ");
            this.cachedSql = `${this.functionName}(${argsSql})`;
        }
        return this.cachedSql;
    };

    public static IsFunctionCall (x : any) : x is FunctionCall {
        if (x instanceof FunctionCall) {
            return true;
        }
        if (x == undefined) {
            return false;
        }

        const mixed = x as Partial<FunctionCall>;
        return (
            (mixed.type == "FunctionCall") &&
            (typeof mixed.functionName == "string") &&
            /**
             * @todo Debate if we should check each element is `FunctionArg`
             * Safer, but slower.
             */
            (Array.isArray(mixed.args)) &&
            (typeof mixed.toSql == "function")
        );
    }

}
export function functionArg (ast : Ast) : FunctionArg {
    if (FunctionArg.IsFunctionArg(ast)) {
        return ast;
    }
    return new FunctionArg(ast);
}
export function functionCall (functionName : string, args : readonly Ast[]) : FunctionCall {
    return new FunctionCall(functionName, args.map(functionArg));
}

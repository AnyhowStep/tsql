/**
 * @todo Refactor `like()` and `notLike()` so they can share code.
 * Something like a `makeLike()` factory function.
 */
import * as tm from "type-mapping";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";
import {makeOperator2} from "../factory";
import {makeOperator3} from "../factory/make-operator-3";
import {BuiltInExpr, BuiltInExprUtil} from "../../built-in-expr";
import {ExprImpl} from "../../expr/expr-impl";
import {IUsedRef} from "../../used-ref";
import {assertValidEscapeChar} from "./like";

export const notLikeImpl = makeOperator2<OperatorType.NOT_LIKE, string, boolean>(
    OperatorType.NOT_LIKE,
    tm.mysql.boolean(),
    TypeHint.STRING
);

export const notLikeEscapeImpl = makeOperator3<OperatorType.NOT_LIKE_ESCAPE, string, string, string, boolean>(
    OperatorType.NOT_LIKE_ESCAPE,
    tm.mysql.boolean(),
    TypeHint.STRING
);

export interface NotLikeExpr<UsedRefT extends IUsedRef> extends ExprImpl<boolean, UsedRefT> {
    /**
     * SQLite requires the `escapeChar` be exactly of length `1`
     */
    escape : (escapeChar : string) => ExprImpl<boolean, UsedRefT>;
}
export function notLike<
    ExprT extends BuiltInExpr<string>,
    PatternT extends BuiltInExpr<string>
> (
    builtInExpr : ExprT,
    pattern : PatternT
) : (
    NotLikeExpr<
        BuiltInExprUtil.IntersectUsedRef<ExprT|PatternT>
    >
) {
    const result = notLikeImpl<ExprT, PatternT>(builtInExpr, pattern) as unknown as (
        NotLikeExpr<
            BuiltInExprUtil.IntersectUsedRef<ExprT|PatternT>
        >
    );
    result.escape = (escapeChar : string) : ReturnType<typeof result.escape> => {
        /**
         * SQLite requires the `escapeChar` be exactly of length `1`
         */
        assertValidEscapeChar(escapeChar);
        const escapedExpr = notLikeEscapeImpl<ExprT, PatternT, string>(builtInExpr, pattern, escapeChar);
        /**
         * @todo Investigate assignability
         */
        return escapedExpr as ReturnType<typeof result.escape>;
    };
    return result;
}

import * as tm from "type-mapping";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";
import {makeOperator2} from "../factory";
import {makeOperator3} from "../factory/make-operator-3";
import {BuiltInExpr, BuiltInExprUtil} from "../../built-in-expr";
import {ExprImpl} from "../../expr/expr-impl";
import {IUsedRef} from "../../used-ref";

/**
 * SQLite requires the `escapeChar` be exactly of length `1`
 */
export function assertValidEscapeChar (escapeChar : string) {
    tm.stringExactLength(1)("escapeChar", escapeChar);
}

export const likeImpl = makeOperator2<OperatorType.LIKE, string, boolean>(
    OperatorType.LIKE,
    tm.mysql.boolean(),
    TypeHint.STRING
);

export const likeEscapeImpl = makeOperator3<OperatorType.LIKE_ESCAPE, string, string, string, boolean>(
    OperatorType.LIKE_ESCAPE,
    tm.mysql.boolean(),
    TypeHint.STRING
);

export interface LikeExpr<UsedRefT extends IUsedRef> extends ExprImpl<boolean, UsedRefT> {
    /**
     * SQLite requires the `escapeChar` be exactly of length `1`
     */
    escape : (escapeChar : string) => ExprImpl<boolean, UsedRefT>;
}
export function like<
    ExprT extends BuiltInExpr<string>,
    PatternT extends BuiltInExpr<string>
> (
    builtInExpr : ExprT,
    pattern : PatternT
) : (
    LikeExpr<
        BuiltInExprUtil.IntersectUsedRef<ExprT|PatternT>
    >
) {
    const result = likeImpl<ExprT, PatternT>(builtInExpr, pattern) as unknown as (
        LikeExpr<
            BuiltInExprUtil.IntersectUsedRef<ExprT|PatternT>
        >
    );
    result.escape = (escapeChar : string) : ReturnType<typeof result.escape> => {
        /**
         * SQLite requires the `escapeChar` be exactly of length `1`
         */
        assertValidEscapeChar(escapeChar);
        const escapedExpr = likeEscapeImpl<ExprT, PatternT, string>(builtInExpr, pattern, escapeChar);
        /**
         * @todo Investigate assignability
         */
        return escapedExpr as ReturnType<typeof result.escape>;
    };
    return result;
}

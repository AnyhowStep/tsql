import * as tm from "type-mapping";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";
import {makeBinaryOperator, BinaryOperator} from "../factory";
import {makeOperator3} from "../factory/make-operator-3";
import {RawExpr, RawExprUtil} from "../../raw-expr";
import {ExprImpl} from "../../expr/expr-impl";
import {IUsedRef} from "../../used-ref";

/**
 * SQLite requires the `escapeChar` be exactly of length `1`
 */
export function assertValidEscapeChar (escapeChar : string) {
    tm.stringExactLength(1)("escapeChar", escapeChar);
}

export const likeImpl : BinaryOperator<string, boolean> = makeBinaryOperator<OperatorType.LIKE, string, boolean>(
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
    ExprT extends RawExpr<string>,
    PatternT extends RawExpr<string>
> (
    rawExpr : ExprT,
    pattern : PatternT
) : (
    LikeExpr<
        RawExprUtil.IntersectUsedRef<ExprT|PatternT>
    >
) {
    const result = likeImpl<ExprT, PatternT>(rawExpr, pattern) as unknown as (
        LikeExpr<
            RawExprUtil.IntersectUsedRef<ExprT|PatternT>
        >
    );
    result.escape = (escapeChar : string) : ReturnType<typeof result.escape> => {
        /**
         * SQLite requires the `escapeChar` be exactly of length `1`
         */
        assertValidEscapeChar(escapeChar);
        const escapedExpr = likeEscapeImpl<ExprT, PatternT, string>(rawExpr, pattern, escapeChar);
        /**
         * @todo Investigate assignability
         */
        return escapedExpr as ReturnType<typeof result.escape>;
    };
    return result;
}

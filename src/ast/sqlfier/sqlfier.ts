import {OperatorSqlfier} from "./operator-sqlfier";
import {IdentifierSqlfier} from "./identifier-sqlfier";
import {QueryBaseSqlfier} from "./query-base-sqlfier";
import {LiteralValueSqlfier} from "./literal-value-sqlfier";
import {CaseValueSqlfier} from "./case-sqlfier";
import {CaseConditionSqlfier} from "./case-condition-sqlfier";
import {ParenthesesSqlfier} from "./parentheses-sqlfier";

export interface Sqlfier {
    readonly identifierSqlfier : IdentifierSqlfier;
    readonly literalValueSqlfier : LiteralValueSqlfier;
    readonly operatorSqlfier : OperatorSqlfier;
    readonly queryBaseSqlfier : QueryBaseSqlfier;
    readonly caseValueSqlfier : CaseValueSqlfier;
    readonly caseConditionSqlfier : CaseConditionSqlfier;
    /**
     * Added specially for MySQL.
     *
     * This is invalid,
     * ```ts
     *  SELECT (
     *      (SELECT 1)
     *      UNION
     *      (SELECT 1)
     *  )
     * ```
     *
     * This is valid,
     * ```ts
     *  SELECT (
     *      SELECT 1
     *      UNION
     *      (SELECT 1)
     *  )
     * ```
     */
    readonly parenthesesSqlfier? : ParenthesesSqlfier;
}

import {OperatorSqlfier} from "./operator-sqlfier";
import {IdentifierSqlfier} from "./identifier-sqlfier";
import {QueryBaseSqlfier} from "./query-base-sqlfier";
import {LiteralValueSqlfier} from "./literal-value-sqlfier";
import {CaseSqlfier} from "./case-sqlfier";
import {CaseConditionSqlfier} from "./case-condition-sqlfier";

export interface Sqlfier {
    readonly identifierSqlfier : IdentifierSqlfier;
    readonly literalValueSqlfier : LiteralValueSqlfier;
    readonly operatorSqlfier : OperatorSqlfier;
    readonly queryBaseSqlfier : QueryBaseSqlfier;
    readonly caseSqlfier : CaseSqlfier;
    readonly caseConditionSqlfier : CaseConditionSqlfier;
}

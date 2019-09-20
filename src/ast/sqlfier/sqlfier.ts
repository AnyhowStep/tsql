import {OperatorSqlfier} from "./operator-sqlfier";
import {IdentifierSqlfier} from "./identifier-sqlfier";
import {QueryBaseSqlfier} from "./query-base-sqlfier";
import {LiteralValueSqlfier} from "./literal-value-sqlfier";

export interface Sqlfier {
    readonly identifierSqlfier : IdentifierSqlfier;
    readonly literalValueSqlfier : LiteralValueSqlfier;
    readonly operatorSqlfier : OperatorSqlfier;
    readonly queryBaseSqlfier : QueryBaseSqlfier;
}

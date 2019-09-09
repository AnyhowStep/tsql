import {OperatorSqlfier} from "./operator-sqlfier";
import {IdentifierSqlfier} from "./identifier-sqlfier";
import {QueryBaseSqlfier} from "./query-base-sqlfier";

export interface Sqlfier {
    readonly identifierSqlfier : IdentifierSqlfier;
    readonly operatorSqlfier : OperatorSqlfier;
    readonly queryBaseSqlfier : QueryBaseSqlfier;
}

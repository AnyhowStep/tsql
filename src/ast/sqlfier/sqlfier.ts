import {OperatorSqlfier} from "./operator-sqlfier";
import {IdentifierSqlfier} from "./identifier-sqlfier";

export interface Sqlfier {
    readonly operatorSqlfier : OperatorSqlfier;
    readonly identifierSqlfier : IdentifierSqlfier;
}

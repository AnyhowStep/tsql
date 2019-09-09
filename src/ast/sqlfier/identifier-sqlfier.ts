import {IdentifierNode} from "../identifier-node";

export interface IdentifierSqlfier {
    (identifierNode : IdentifierNode) : string;
}

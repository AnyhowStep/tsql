import {Sqlfier} from "./sqlfier";
import {OperatorType} from "../../operator-type";
import {OperatorSqlfier} from "./operator-sqlfier";
import {Writable} from "../../type-util";
import {OperatorNode} from "../operator-node";
import {LiteralValueNode, LiteralValueType} from "../literal-value-node";
import {LiteralValueSqlfier} from "./literal-value-sqlfier";

const notImplemented = () => {
    throw new Error(`Not implemented`);
};

const operatorNotImplemented = (operatorNode : OperatorNode) => {
    throw new Error(`Not implemented ${operatorNode.operatorType}`);
};

const literalValueNotImplemented = (literalValueNode : LiteralValueNode) => {
    throw new Error(`Not implemented ${literalValueNode.literalValueType}`);
};

export const notImplementedSqlfier : Sqlfier = {
    identifierSqlfier : notImplemented,
    literalValueSqlfier : Object
        .values<LiteralValueType>(LiteralValueType as unknown as { [k:string] :LiteralValueType })
        .reduce<Writable<LiteralValueSqlfier>>(
            (memo, literalValueType) => {
                memo[literalValueType] = literalValueNotImplemented;
                return memo;
            },
            {} as Writable<LiteralValueSqlfier>
        ),
    operatorSqlfier : Object
        .values<OperatorType>(OperatorType as unknown as { [k:string] : OperatorType })
        .reduce<Writable<OperatorSqlfier>>(
            (memo, operatorType) => {
                memo[operatorType] = operatorNotImplemented;
                return memo;
            },
            {} as Writable<OperatorSqlfier>
        ),
    queryBaseSqlfier : notImplemented,
    caseSqlfier : notImplemented,
    caseWhenSqlfier : notImplemented,
};

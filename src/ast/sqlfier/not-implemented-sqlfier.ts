import {Sqlfier} from "./sqlfier";
import {OperatorType} from "../../operator-type";
import {OperatorSqlfier} from "./operator-sqlfier";
import {Writable} from "../../type-util";
import {OperatorNode} from "../operator-node";

const notImplemented = () => {
    throw new Error(`Not implemented`);
};

const operatorNotImplemented = (operatorNode : OperatorNode) => {
    throw new Error(`Not implemented ${operatorNode.operatorType}`);
};

export const notImplementedSqlfier : Sqlfier = {
    identifierSqlfier : notImplemented,
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
};

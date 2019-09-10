import {Sqlfier} from "./sqlfier";
import {OperatorType} from "../../operator-type";
import {OperatorSqlfier} from "./operator-sqlfier";
import {Writable} from "../../type-util";

const notImplemented = () => {
    throw new Error(`Not implemented`);
};

export const notImplementedSqlfier : Sqlfier = {
    identifierSqlfier : notImplemented,
    operatorSqlfier : Object
        .values<OperatorType>(OperatorType as unknown as { [k:string] : OperatorType })
        .reduce<Writable<OperatorSqlfier>>(
            (memo, operatorType) => {
                memo[operatorType] = notImplemented;
                return memo;
            },
            {} as Writable<OperatorSqlfier>
        ),
    queryBaseSqlfier : notImplemented,
};

import * as tm from "type-mapping";
import {IDataType} from "../../data-type";
import {isObjectWithOwnEnumerableKeys} from "../../../type-util";

export function isDataType<TypeT> (raw : tm.SafeMapper<TypeT>) : raw is IDataType<TypeT>;
export function isDataType (raw : unknown) : raw is IDataType<unknown>;
export function isDataType (raw : unknown) : raw is IDataType<unknown> {
    if (typeof raw != "function") {
        return false;
    }
    if (!isObjectWithOwnEnumerableKeys<IDataType<unknown>>()(
        raw,
        [
            "toRawExpr",
            "isNullSafeEqual",
        ]
    )) {
        return false;
    }
    return (
        (typeof raw.toRawExpr == "function") &&
        (typeof raw.isNullSafeEqual == "function")
    );
}

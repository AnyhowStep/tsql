import * as tm from "type-mapping";
import {IDataType} from "../../data-type";
import {RawExprNoUsedRef_Output} from "../../../raw-expr";
import {DataType} from "../../data-type-impl";

export function makeDataType<TypeT>(
    mapper : tm.SafeMapper<TypeT>,
    toRawExpr : (value : TypeT) => RawExprNoUsedRef_Output<TypeT>,
    isNullSafeEqual : (a : TypeT, b : TypeT) => boolean,
    extraMapper? : tm.Mapper<TypeT, TypeT>
) : DataType<TypeT> {
    const myMapper : tm.SafeMapper<TypeT> = (
        extraMapper == undefined ?
        mapper :
        tm.pipe(mapper, extraMapper as any)
    );
    function dataType (name : string, mixed : unknown) : TypeT {
        return myMapper(name, mixed);
    }
    dataType.toRawExpr = toRawExpr;
    dataType.isNullSafeEqual = isNullSafeEqual;
    dataType.orNull = () : IDataType<TypeT|null> => {
        return makeDataType(
            tm.orNull(myMapper),
            (value : TypeT|null) : RawExprNoUsedRef_Output<TypeT|null> => {
                if (value === null) {
                    return null;
                } else {
                    const rawExpr : RawExprNoUsedRef_Output<TypeT> = toRawExpr(value);
                    return rawExpr as RawExprNoUsedRef_Output<TypeT|null>;
                }
            },
            (a : TypeT|null, b : TypeT|null) : boolean => {
                if (a === null) {
                    if (b === null) {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    if (b === null) {
                        return false;
                    } else {
                        return isNullSafeEqual(a, b);
                    }
                }
            }
        );
    };
    return dataType;
}

import * as tm from "type-mapping";
import {IDataType} from "../../data-type";
import {BuiltInExpr_NonCorrelated} from "../../../raw-expr";
import {DataType} from "../../data-type-impl";

export function makeDataType<TypeT>(
    mapper : tm.SafeMapper<TypeT>,
    toBuiltInExpr_NonCorrelated : (value : TypeT) => BuiltInExpr_NonCorrelated<TypeT>,
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
    dataType.toBuiltInExpr_NonCorrelated = toBuiltInExpr_NonCorrelated;
    dataType.isNullSafeEqual = isNullSafeEqual;
    dataType.orNull = () : IDataType<TypeT|null> => {
        return makeDataType(
            tm.orNull(myMapper),
            (value : TypeT|null) : BuiltInExpr_NonCorrelated<TypeT|null> => {
                if (value === null) {
                    return null;
                } else {
                    const rawExpr : BuiltInExpr_NonCorrelated<TypeT> = toBuiltInExpr_NonCorrelated(value);
                    return rawExpr as BuiltInExpr_NonCorrelated<TypeT|null>;
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

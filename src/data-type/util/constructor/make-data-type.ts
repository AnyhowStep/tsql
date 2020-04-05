import * as tm from "type-mapping";
import {IDataType} from "../../data-type";
import {BuiltInExpr_NonCorrelated_NonAggregate} from "../../../built-in-expr";
import {DataType} from "../../data-type-impl";

/**
 * A helper function to create an object that implements `IDataType<TypeT>`
 *
 * @param mapper - Deserializes data from SQL to JS
 * @param toBuiltInExpr_NonCorrelated - Serializes a JS value to a squill expression
 * @param isNullSafeEqual - Determines if two JS values are equal
 * @param extraMapper - Optional argument. May be used to restrict the domain of valid values.
 */
export function makeDataType<TypeT>(
    mapper : tm.SafeMapper<TypeT>,
    toBuiltInExpr_NonCorrelated : (value : TypeT) => BuiltInExpr_NonCorrelated_NonAggregate<TypeT>,
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
            (value : TypeT|null) : BuiltInExpr_NonCorrelated_NonAggregate<TypeT|null> => {
                if (value === null) {
                    return null;
                } else {
                    const rawExpr : BuiltInExpr_NonCorrelated_NonAggregate<TypeT> = toBuiltInExpr_NonCorrelated(value);
                    return rawExpr as BuiltInExpr_NonCorrelated_NonAggregate<TypeT|null>;
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

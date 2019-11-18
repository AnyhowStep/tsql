import * as tm from "type-mapping";
import * as DataTypeUtil from "../util";
import {DataType} from "../data-type-impl";

export function makeBooleanDataType (
    mapper : tm.SafeMapper<boolean>
) : (
    (extraMapper? : tm.Mapper<boolean, boolean>) => DataType<boolean>
) {
    return (extraMapper? : tm.Mapper<boolean, boolean>) => DataTypeUtil.makeDataType(
        mapper,
        value => value,
        (a, b) => a === b,
        extraMapper
    );
}

/**
 * + MySQL      : `TINYINT` (Emulates `boolean`)
 * + PostgreSQL : `boolean`
 * + SQLite     : `INTEGER` (Emulates `boolean`)
 */
export const dtBoolean = makeBooleanDataType(tm.mysql.boolean());

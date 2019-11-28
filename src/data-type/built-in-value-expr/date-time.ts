import * as tm from "type-mapping";
import * as DataTypeUtil from "../util";
import {DataType} from "../data-type-impl";
import {BuiltInValueExprUtil} from "../../built-in-value-expr";

export function makeDateTimeDataType (
    mapperFactory : (fractionalSecondPrecision : 0|1|2|3/*|4|5|6*/) => tm.SafeMapper<Date>
) : (
    (
        fractionalSecondPrecision : 0|1|2|3/*|4|5|6*/,
        extraMapper? : tm.Mapper<Date, Date>
    ) => DataType<Date>
) {
    return (
        fractionalSecondPrecision : 0|1|2|3/*|4|5|6*/,
        extraMapper? : tm.Mapper<Date, Date>
    ) => DataTypeUtil.makeDataType(
        mapperFactory(fractionalSecondPrecision),
        value => value,
        (a, b) => BuiltInValueExprUtil.isEqual(a, b),
        extraMapper
    );
}

/**
 * + MySQL      : `DATETIME`
 * + PostgreSQL : `TIMESTAMP`
 * + SQLite     : `TEXT` (Emulates `DATETIME`)
 *
 * SQLite only supports up to millisecond precision.
 *
 * JS only supports up to millisecond precision.
 *
 * + `0` = second
 * + `1` = deci-second
 * + `2` = centi-second
 * + `3` = millisecond
 *
 * @param fractionalSecondPrecision - `3` is recommended; millisecond precision.
 */
export const dtDateTime = makeDateTimeDataType(tm.mysql.dateTime);

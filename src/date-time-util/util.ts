/**
 * Right now, this is MySQL-specific.
 *
 * But I imagine this should work on most (all?) SQL databases.
 *
 * @todo Investigate. If incompatible, fix.
 */
import {escapeValue as escape} from "../sqlstring";
import * as StringUtil from "../string-util";

//Uses UTC
//Truncates if fractionSecondPrecision is too small.
export function toSqlUtc (d : Date, fractionalSecondPrecision : 0|1|2|3/*|4|5|6*/) : string {
    if (!isFinite(d.getTime())) {
        throw new Error("Invalid date passed");
    }
    const year = StringUtil.zeroPad(d.getUTCFullYear(), 4);
    //getUTCMonth() returns [0, 11]
    //We want [1, 12]
    const month = StringUtil.zeroPad(d.getUTCMonth() + 1, 2);
    const day = StringUtil.zeroPad(d.getUTCDate(), 2);
    const hour = StringUtil.zeroPad(d.getUTCHours(), 2);
    const minute = StringUtil.zeroPad(d.getUTCMinutes(), 2);
    const second = StringUtil.zeroPad(d.getUTCSeconds(), 2);
    if (fractionalSecondPrecision == 0) {
        /*
            https://dev.mysql.com/doc/refman/8.0/en/date-and-time-literals.html

            The TIMESTAMP syntax produces a DATETIME value in MySQL
            because DATETIME has a range that more closely corresponds
            to the standard SQL TIMESTAMP type,
            which has a year range from 0001 to 9999.

            (The MySQL TIMESTAMP year range is 1970 to 2038.)
        */
        return [
            "(TIMESTAMP ",
            escape(`${year}-${month}-${day} ${hour}:${minute}:${second}`),
            ")"
        ].join("");
    } else {
        const ms = StringUtil.zeroPad(
            d.getUTCMilliseconds(),
            fractionalSecondPrecision
        ).substr(
            0,
            fractionalSecondPrecision
        );
        /*
            https://dev.mysql.com/doc/refman/8.0/en/date-and-time-literals.html

            The TIMESTAMP syntax produces a DATETIME value in MySQL
            because DATETIME has a range that more closely corresponds
            to the standard SQL TIMESTAMP type,
            which has a year range from 0001 to 9999.

            (The MySQL TIMESTAMP year range is 1970 to 2038.)
        */
        return [
            "(TIMESTAMP ",
            escape(`${year}-${month}-${day} ${hour}:${minute}:${second}.${ms}`),
            ")"
        ].join("");
    }
}

//Month is zero-based
//Day is one-based
function isValidDate (year : number, month : number, day : number) {
    var d = new Date(year, month, day);
    if (d.getFullYear() === year && d.getMonth() === month && d.getDate() === day) {
        return true;
    }
    return false;
}

const mySqlDateTimeRegex = /^(\d{4})-(\d{2})-(\d{2})( (\d{2}):(\d{2}):(\d{2})(\.(\d{1,6}))?)?$/;
//Assumes UTC
export function fromSqlUtc (sql : string, fractionalSecondPrecision : 0|1|2|3/*|4|5|6*/) : Date {
    const match = mySqlDateTimeRegex.exec(sql);
    if (match == undefined) {
        throw new Error(`Invalid MySQL DATETIME string`);
    }

    const year = parseInt(match[1]);
    //1-based
    const month = parseInt(match[2]);
    //1-based
    const dayOfMonth = parseInt(match[3]);

    if (!isValidDate(year, month-1, dayOfMonth)) {
        throw new Error(`Invalid MySQL DATETIME string; month or day does not exist for given year`);
    }

    const hour = (match[5] == undefined) ?
        0 :
        parseInt(match[5]);
    if (hour > 23) {
        throw new Error(`Hour must be [0, 23]`);
    }
    const minute = (match[6] == undefined) ?
        0 :
        parseInt(match[6]);
    if (minute > 59) {
        throw new Error(`Minute must be [0, 59]`);
    }
    const second = (match[7] == undefined) ?
        0 :
        parseInt(match[7]);
    if (second > 59) {
        throw new Error(`Second must be [0, 59]`);
    }

    const microsecondPart = (match[9] == undefined) ?
        0 :
        parseInt(StringUtil.trailingZeroPad(match[9], 6));
    if (microsecondPart > 999999) {
        throw new Error(`Microsecond must be [0, 999999]`);
    }

    const millisecond = Math.floor(microsecondPart/1000);
    const microsecond = microsecondPart % 1000;

    if (
        match[9] != undefined &&
        match[9].length > fractionalSecondPrecision
    ) {
        throw new Error(`Expected DATETIME(${fractionalSecondPrecision}), received DATETIME(${match[9].length})`);
    }

    //TODO-FEATURE Microsecond support
    //BEGIN TEMPORARY NON-SUPPORT FOR MICROSECOND
    if (microsecond != 0) {
        throw new Error(`Microsecond support for DATETIME is not supported yet`);
    }
    //END TEMPORARY NON-SUPPORT FOR MICROSECOND

    const utcMillisecondTimestamp =  Date.UTC(
        year,
        //Date.UTC() expects [0, 11]
        month-1,
        dayOfMonth,
        hour,
        minute,
        second,
        millisecond
    );
    return new Date(utcMillisecondTimestamp);
}

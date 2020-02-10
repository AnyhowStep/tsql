
/**
 * 1-based month
 */
export function lastDay (year : number, month : number) {
    switch (month) {
        case 1:
        case 3:
        case 5:
        case 7:
        case 8:
        case 10:
        case 12: {
            return 31;
        }
        case 2: {
            return (year%4 == 0) ? 29 : 28;
        }
        default : {
            return 30;
        }
    }
}
/**
 * Emulates MySQL's `TIMESTAMPADD(MONTH, x, datetime)` algorithm.
 */
export function mysqlAddMonths (curYear : number, curMonth : number, curDay : number, rawDeltaMonth : number) {
    const monthsSince_0000_01 = curYear * 12 + (curMonth-1) + rawDeltaMonth;
    const resultYear = Math.floor(monthsSince_0000_01/12);
    //+1 to convert back to 1-based month
    const resultMonth = monthsSince_0000_01%12 + 1;

    const lastDayOfResult = lastDay(resultYear, resultMonth);
    return [resultYear, resultMonth, (curDay > lastDayOfResult) ? lastDayOfResult : curDay];
}

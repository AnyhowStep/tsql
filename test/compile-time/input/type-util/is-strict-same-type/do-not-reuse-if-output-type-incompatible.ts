import * as tsql from "../../../../../dist";

//Should be `Date|null`
export const expr = tsql.timestampAddYear(
    -32n,
    tsql.currentDate()
);


//Should be `Date`
export const a = tsql.currentDate();
//Should be `Date|null`
export const b = tsql.timestampAddYear(-32n, new Date());

//Should be `false`
declare function foo () : tsql.TypeUtil.IsStrictSameType<typeof a, typeof b>;
//Should be `false`
export const fooVal = foo();

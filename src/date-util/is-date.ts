export function isDate (x : unknown) : x is Date {
    return Object.prototype.toString.call(x) === "[object Date]";
}
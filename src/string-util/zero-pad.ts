/*
    zeroPad(1, 4)     === "0001"
    zeroPad(34, 4)    === "0034"
    zeroPad(678, 4)   === "0678"
    zeroPad(1337, 4)  === "1337"
    zeroPad(92678, 4) === "92678"
*/
export function zeroPad (num : number, length : number) {
    const str = num.toString();
    if (str.length < length) {
        return "0".repeat(length-str.length) + str;
    } else {
        return str;
    }
}
export function trailingZeroPad (num : number|string, length : number) {
    const str = num.toString();
    if (str.length < length) {
        return str + "0".repeat(length-str.length);
    } else {
        return str;
    }
}

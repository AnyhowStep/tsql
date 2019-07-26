export function pickOwnEnumerable<
    ObjT extends { [k:string] : unknown },
    KeysT extends readonly Extract<keyof ObjT, string>[]
>(
    obj : ObjT,
    keys : KeysT
) : Pick<ObjT, KeysT[number]> {
    const result : any = {};
    for (const k of keys) {
        if (
            Object.prototype.hasOwnProperty.call(obj, k) &&
            Object.prototype.propertyIsEnumerable.call(obj, k)
        ) {
            result[k] = obj[k];
        }
    }
    return result;
}
export function omitOwnEnumerable<
    ObjT extends { [k:string] : unknown },
    KeysT extends readonly Extract<keyof ObjT, string>[]
>(
    obj : ObjT,
    keys : KeysT
) : Omit<ObjT, KeysT[number]> {
    const result : any = {};
    for (const k of Object.keys(obj)) {
        if (
            Object.prototype.propertyIsEnumerable.call(obj, k) &&
            keys.indexOf(k as Extract<keyof ObjT, string>) < 0
        ) {
            result[k] = obj[k];
        }
    }
    return result;
}
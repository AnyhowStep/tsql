import {CompileError} from "../compile-error";

export function isObjectWithOwnEnumerableKeys<T> () {
    return <K extends Extract<keyof T, string>>(
        raw : unknown,
        keys : (
            Extract<keyof T, string> extends K ?
            K[] :
            CompileError<[
                "Missing keys",
                Exclude<Extract<keyof T, string>, K>
            ]>
        )
    ) : raw is {
        [k in Extract<keyof T, string>] : unknown
    } => {
        if (raw == undefined) {
            return false;
        }
        if (!(raw instanceof Object)) {
            return false;
        }
        for (const k of keys as K[]) {
            if (!Object.prototype.hasOwnProperty.call(raw, k)) {
                return false;
            }
            if (!Object.prototype.propertyIsEnumerable.call(raw, k)) {
                return false;
            }
        }
        return true;
    }
}
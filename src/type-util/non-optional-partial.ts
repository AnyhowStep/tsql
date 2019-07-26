/**
 * + `{ x : undefined }` is assignable to `Partial<{ x : number }>`
 * + `{ x : undefined }` is **NOT** assignable to `NonOptionalPartial<{ x : number }>`
 * + `{}` is assignable to `Partial<{ x : number }>`
 * + `{}` is **NOT** assignable to `NonOptionalPartial<{ x : number }>`
 * + `{ x : number }` is assignable to `Partial<{ x : number }>`
 * + `{ x : number }` is assignable to `NonOptionalPartial<{ x : number }>`
 */
export type NonOptionalPartial<T> = (
    {
        [k in keyof T] : (
            {
                [propertyName in k] : T[k]
            }
        )
    }[keyof T]
);

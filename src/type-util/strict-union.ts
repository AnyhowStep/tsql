type UnionKeys<T> = (
    T extends unknown ?
    keyof T :
    never
);
type StrictUnionImpl<T, TAll> = (
    T extends unknown ?
    (
        & T
        /**
         * @todo Debate which looks nicer.
         */
        /*
        & {
            [k in Exclude<UnionKeys<TAll>, keyof T>]? : never
        }
        //*/
        //*
        & (
            Exclude<UnionKeys<TAll>, keyof T> extends never ?
            /**
             * If there are no other keys, we just have `T`.
             * This makes the resulting type "look nicer".
             */
            unknown :
            /**
             * If we have other keys, the resulting type looks a little ugly.
             */
            Partial<
                Record<
                    Exclude<UnionKeys<TAll>, keyof T>,
                    never
                >
            >
        )
        //*/
    ) :
    never
);
/**
 * TS has excess property checks for object literals.
 *
 * However, it seems to not be performed when the destination type is a union.
 *
 * https://github.com/microsoft/TypeScript/issues/20863#issuecomment-520303071
 *
 * -----
 *
 * This is a workaround and isn't perfect but it almost behaves like excess property checks
 * for object literals when the destination type is a union.
 *
 * https://github.com/microsoft/TypeScript/issues/20863#issuecomment-479471546
 */
export type StrictUnion<T> = StrictUnionImpl<T, T>;

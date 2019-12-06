import {TypeUtil} from "type-mapping";

export type UnionToIntersection<U> = TypeUtil.UnionToIntersection<U>;

/**
 * https://github.com/microsoft/TypeScript/issues/29594#issuecomment-560760300
 */
export type UnionToIntersection2<
    U extends BaseT,
    BaseT
> =
    Extract<
        UnionToIntersection<U>,
        BaseT
    >
;

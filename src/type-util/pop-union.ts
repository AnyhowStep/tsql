import {UnionToIntersection} from "./union-to-intersection";

type UnionToFunctionOverloads<U> = (
    UnionToIntersection<
        U extends any ?
        (f: U) => void :
        never
    >
);
export type PopUnion<U> = (
    UnionToFunctionOverloads<U> extends ((a: infer A) => void) ?
    A :
    never
);

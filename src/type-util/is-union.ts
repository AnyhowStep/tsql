import {UnionToIntersection} from "./union-to-intersection";
import {CompileError} from "../compile-error";

export type IsUnion<T> = [T] extends [UnionToIntersection<T>] ? false : true;

export type AssertNonUnion<T> =
    [T] extends [UnionToIntersection<T>] ?
    unknown :
    CompileError<[
        "Union type not allowed"
    ]>
;

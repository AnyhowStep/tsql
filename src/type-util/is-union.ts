import {UnionToIntersection} from "./union-to-intersection";

export type IsUnion<T> = [T] extends [UnionToIntersection<T>] ? false : true;

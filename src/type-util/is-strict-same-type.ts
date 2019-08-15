export type IsStrictSameType<A1 extends any, A2 extends any> =
    (<A>() => A extends A1 ? true : false) extends (<A>() => A extends A2 ? true : false)
    ? true
    : false
;

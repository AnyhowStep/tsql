export type Outersect<A, B> =
    | Exclude<A, B>
    | Exclude<B, A>
;

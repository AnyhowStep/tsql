export type MaxDepth = 8;
type Countdown = [0,0,1,2,3,4,5,6,7]
export type DecrementMaxDepth<MaxDepthT extends number> =
    Countdown[MaxDepthT]
;

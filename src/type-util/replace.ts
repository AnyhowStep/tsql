/**
 * Replaces all instances of `NeedleT` with `ReplacementT`
 */
export type Replace<
    T,
    NeedleT,
    ReplacementT
> = (
    T extends NeedleT ?
    ReplacementT :
    T
);

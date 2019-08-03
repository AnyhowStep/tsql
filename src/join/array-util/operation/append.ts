import {IJoin} from "../../join";

export type Append<
    ArrT extends readonly IJoin[],
    JoinT extends IJoin
> = (
    readonly (
        ArrT[number] |
        JoinT
    )[]
);

export function append<
    ArrT extends readonly IJoin[],
    JoinT extends IJoin
> (
    arr : ArrT,
    join : JoinT
) : (
    Append<ArrT, JoinT>
) {
    return [...arr, join];
}

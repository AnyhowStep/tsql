import {IJoin} from "../join";

export interface JoinMap {
    readonly [tableAlias : string] : IJoin
};
export interface WritableJoinMap {
    [tableAlias : string] : IJoin
}

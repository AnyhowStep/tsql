import {TypeMap} from "../type-map";

export interface TypeRef {
    readonly [tableAlias : string] : TypeMap;
}

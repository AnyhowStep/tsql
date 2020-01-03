import {IQueryBase} from "../../../query-base";

export interface SelectResult {
    query   : { sql : string },
    rows    : Record<string, unknown>[],
    columns : string[],
}
export interface Select {
    select (query : IQueryBase) : Promise<SelectResult>;
}

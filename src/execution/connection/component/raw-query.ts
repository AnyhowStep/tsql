export interface RawQueryResult {
    query   : { sql : string },
    results : unknown|undefined,
    columns : string[]|undefined,
}
export interface RawQuery {
    rawQuery (sql : string) : Promise<RawQueryResult>;
}

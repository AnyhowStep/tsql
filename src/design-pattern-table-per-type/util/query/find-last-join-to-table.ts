import {ITablePerType} from "../../table-per-type";

export function findLastJoinToTable (
    tpt : ITablePerType,
    toTableAlias : string
) : readonly [string, string] {
    for (let i=tpt.joins.length-1; i>=0; --i) {
        if (tpt.joins[i][1] == toTableAlias) {
            return tpt.joins[i];
        }
    }
    throw new Error(`No join to ${toTableAlias} exists in table-per-type hierarchy for ${tpt.childTable.alias}`);
}

import {ITablePerType} from "../../table-per-type";
import {KeyUtil} from "../../../key";

export type GeneratedColumnAlias<TptT extends ITablePerType> =
    (
        | TptT["childTable"]
        | TptT["parentTables"][number]
    )["generatedColumns"][number]
;

export function generatedColumnAliases<TptT extends ITablePerType> (
    tpt : TptT
) : GeneratedColumnAlias<TptT>[] {
    const result : string[] = [
        ...tpt.childTable.generatedColumns,
    ];

    for (const parentTable of tpt.parentTables) {
        result.push(...parentTable.generatedColumns);
    }

    return KeyUtil.removeDuplicates(result) as GeneratedColumnAlias<TptT>[];
}

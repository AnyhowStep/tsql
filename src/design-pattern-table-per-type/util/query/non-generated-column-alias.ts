import {ITablePerType} from "../../table-per-type";
import {ColumnAlias, columnAliases} from "./column-alias";
import {GeneratedColumnAlias, generatedColumnAliases} from "./generated-column-alias";

export type NonGeneratedColumnAlias<TptT extends ITablePerType> =
    Exclude<
        ColumnAlias<TptT>,
        GeneratedColumnAlias<TptT>
    >
;

export function nonGeneratedColumnAliases<TptT extends ITablePerType> (
    tpt : TptT
) : NonGeneratedColumnAlias<TptT>[] {
    const generated = generatedColumnAliases(tpt);

    const result : string[] = columnAliases(tpt)
        .filter(columnAlias => {
            return !generated.includes(columnAlias);
        });


    return result as NonGeneratedColumnAlias<TptT>[];
}

import {ITablePerType} from "../../table-per-type";
import {ExplicitDefaultValueColumnAlias, isExplicitDefaultValueColumnAlias} from "./explicit-default-value-column-alias";
import {NullableColumnAlias, isNullableColumnAlias} from "./nullable-column-alias";
import {GeneratedColumnAlias, isGeneratedColumnAlias} from "./generated-column-alias";
import {columnAliases, ColumnAlias, isColumnAlias} from "./column-alias";

/**
 * @todo Can we somehow handle `autoIncrement`?
 */
export type RequiredColumnAlias<TptT extends ITablePerType> =
    Exclude<
        ColumnAlias<TptT>,
        (
            | GeneratedColumnAlias<TptT>
            | NullableColumnAlias<TptT>
            | ExplicitDefaultValueColumnAlias<TptT>
        )
    >
;

export function isRequiredColumnAlias<TptT extends ITablePerType> (
    tpt : TptT,
    columnAlias : string
) : columnAlias is RequiredColumnAlias<TptT> {
    return (
        isColumnAlias(tpt, columnAlias) &&
        !(
            isGeneratedColumnAlias(tpt, columnAlias) ||
            isNullableColumnAlias(tpt, columnAlias) ||
            isExplicitDefaultValueColumnAlias(tpt, columnAlias)
        )
    );
}

export function requiredColumnAliases<TptT extends ITablePerType> (
    tpt : TptT
) : RequiredColumnAlias<TptT>[] {
    const result : string[] = [];

    for (const columnAlias of columnAliases(tpt)) {
        if (isRequiredColumnAlias(tpt, columnAlias)) {
            result.push(columnAlias);
        }
    }

    return result as RequiredColumnAlias<TptT>[];
}

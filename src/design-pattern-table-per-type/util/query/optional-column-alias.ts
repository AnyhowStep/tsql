import {ITablePerType} from "../../table-per-type";
import {ExplicitDefaultValueColumnAlias, isExplicitDefaultValueColumnAlias} from "./explicit-default-value-column-alias";
import {NullableColumnAlias, isNullableColumnAlias} from "./nullable-column-alias";
import {GeneratedColumnAlias, isGeneratedColumnAlias} from "./generated-column-alias";
import {columnAliases} from "./column-alias";
import {Identity} from "../../../type-util";

export type OptionalColumnAlias<TptT extends ITablePerType> =
    Identity<
        | TptT["explicitAutoIncrementValueEnabled"][number]
        | Exclude<
            (
                | NullableColumnAlias<TptT>
                | ExplicitDefaultValueColumnAlias<TptT>
            ),
            GeneratedColumnAlias<TptT>
        >
    >
;

export function isOptionalColumnAlias<TptT extends ITablePerType> (
    tpt : TptT,
    columnAlias : string
) : columnAlias is OptionalColumnAlias<TptT> {
    return (
        tpt.explicitAutoIncrementValueEnabled.includes(columnAlias) ||
        (
            (
                isNullableColumnAlias(tpt, columnAlias) ||
                isExplicitDefaultValueColumnAlias(tpt, columnAlias)
            ) &&
            !isGeneratedColumnAlias(tpt, columnAlias)
        )
    );
}

export function optionalColumnAliases<TptT extends ITablePerType> (
    tpt : TptT
) : OptionalColumnAlias<TptT>[] {
    const result : string[] = [];

    for (const columnAlias of columnAliases(tpt)) {
        if (isOptionalColumnAlias(tpt, columnAlias)) {
            result.push(columnAlias);
        }
    }

    return result as OptionalColumnAlias<TptT>[];
}

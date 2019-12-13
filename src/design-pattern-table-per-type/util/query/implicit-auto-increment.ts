import {ITablePerType} from "../../table-per-type";

export type ImplicitAutoIncrement<TptT extends ITablePerType> =
    Exclude<
        TptT["autoIncrement"][number],
        TptT["explicitAutoIncrementValueEnabled"][number]
    >
;

export function implicitAutoIncrement<
    TptT extends ITablePerType
> (
    tpt : TptT
) : ImplicitAutoIncrement<TptT>[] {
    return tpt.autoIncrement.filter(columnAlias => {
        return !tpt.explicitAutoIncrementValueEnabled.includes(columnAlias);
    }) as ImplicitAutoIncrement<TptT>[];
}

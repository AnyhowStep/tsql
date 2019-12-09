import {ITable} from "../../table";

/**
 * Auto-increment column is explicit if `explicitAutoIncrementValueEnabled` is true.
 */
export type ExplicitAutoIncrement<
    TableT extends Pick<
        ITable,
        | "autoIncrement"
        | "explicitAutoIncrementValueEnabled"
    >
> = (
    TableT["explicitAutoIncrementValueEnabled"] extends true ?
    Extract<TableT["autoIncrement"], string> :
    never
);

/**
 * Auto-increment column is **implicit** if `explicitAutoIncrementValueEnabled` is `false` or `boolean`.
 */
export type ImplicitAutoIncrement<
    TableT extends Pick<
        ITable,
        | "autoIncrement"
        | "explicitAutoIncrementValueEnabled"
    >
> = (
    false extends TableT["explicitAutoIncrementValueEnabled"] ?
    Extract<TableT["autoIncrement"], string> :
    never
);

export function isExplicitAutoIncrement<
    TableT extends Pick<
        ITable,
        | "autoIncrement"
        | "explicitAutoIncrementValueEnabled"
    >
> (table : TableT, columnAlias : string) : columnAlias is ExplicitAutoIncrement<TableT> {
    if (table.explicitAutoIncrementValueEnabled) {
        return columnAlias === table.autoIncrement;
    } else {
        return false;
    }
}

export function isImplicitAutoIncrement<
    TableT extends Pick<
        ITable,
        | "autoIncrement"
        | "explicitAutoIncrementValueEnabled"
    >
> (table : TableT, columnAlias : string) : columnAlias is ImplicitAutoIncrement<TableT> {
    if (!table.explicitAutoIncrementValueEnabled) {
        return columnAlias === table.autoIncrement;
    } else {
        return false;
    }
}

import {ITablePerType} from "../../table-per-type";

export type ImplicitAutoIncrement<TptT extends ITablePerType> =
    Exclude<
        TptT["autoIncrement"][number],
        TptT["explicitAutoIncrementValueEnabled"][number]
    >
;

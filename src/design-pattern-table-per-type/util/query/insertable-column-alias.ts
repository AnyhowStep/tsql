import {ITablePerType} from "../../table-per-type";
import {ColumnAlias} from "./column-alias";
import {GeneratedColumnAlias} from "./generated-column-alias";
import {ImplicitAutoIncrement} from "./implicit-auto-increment";

export type InsertableColumnAlias<TptT extends ITablePerType> =
    Exclude<
        ColumnAlias<TptT>,
        (
            | GeneratedColumnAlias<TptT>
            | ImplicitAutoIncrement<TptT>
        )
    >
;

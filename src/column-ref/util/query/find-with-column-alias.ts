import {ColumnRef} from "../../column-ref";
import {ColumnMapUtil} from "../../../column-map";

export type FindWithColumnAlias<RefT extends ColumnRef, ColumnAliasT extends string> = (
    RefT extends ColumnRef ?
    ColumnMapUtil.FindWithColumnAlias<
        RefT[Extract<keyof RefT, string>],
        ColumnAliasT
    > :
    never
);

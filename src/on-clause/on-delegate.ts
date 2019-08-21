import * as tm from "type-mapping";
import {FromClauseUtil} from "../from-clause";
import {IAliasedTable} from "../aliased-table";
import {IExpr} from "../expr";
import * as OnClauseUtil from "./util";

export type OnDelegate<
    FromClauseT extends Pick<FromClauseUtil.AfterFromClause, "currentJoins">,
    AliasedTableT extends IAliasedTable
> =
    (
        columns : OnClauseUtil.AllowedColumnRef<FromClauseT, AliasedTableT>
    ) => IExpr<{
        mapper : tm.SafeMapper<boolean>,
        usedRef : OnClauseUtil.AllowedUsedRef<FromClauseT, AliasedTableT>
    }>
;

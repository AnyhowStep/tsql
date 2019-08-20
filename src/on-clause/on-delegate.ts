import * as tm from "type-mapping";
import {FromClauseUtil} from "../from-clause";
import {IAliasedTable} from "../aliased-table";
import {ColumnRefUtil} from "../column-ref";
import {JoinUtil} from "../join";
import {IExpr} from "../expr";
import {UsedRefUtil} from "../used-ref";

export type OnDelegate<
    FromClauseT extends Pick<FromClauseUtil.AfterFromClause, "currentJoins">,
    AliasedTableT extends IAliasedTable
> = (
    (
        columns : ColumnRefUtil.FromJoinArray<
            | FromClauseT["currentJoins"]
            | JoinUtil.FromAliasedTable<AliasedTableT, false>[]
        >
    ) => IExpr<{
        mapper : tm.SafeMapper<boolean>,
        usedRef : UsedRefUtil.FromJoinArray<
            | FromClauseT["currentJoins"]
            | JoinUtil.FromAliasedTable<AliasedTableT, false>[]
        >
    }>
);

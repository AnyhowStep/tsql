import {IFromClause} from "../../../from-clause";
import {IAliasedTable} from "../../../aliased-table";
import {BeforeFromClause} from "../../helper-type";
import {JoinUtil} from "../../../join";

export type From<QueryT extends BeforeFromClause, AliasedTableT extends IAliasedTable> = (
    IFromClause<{
        parentJoins : FromClauseT["parentJoins"],
        currentJoins : readonly JoinUtil.FromAliasedTable<AliasedTableT, false>[],
    }>
);

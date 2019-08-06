import {IFromClause} from "../../from-clause";
import {IAliasedTable} from "../../../aliased-table";
import {IJoin} from "../../../join";
import {UsedRefUtil} from "../../../used-ref";

export type AllowedUsedRef<
    FromClauseT extends IFromClause,
    AliasedTableT extends Pick<IAliasedTable, "isLateral">
> = (
    UsedRefUtil.FromJoinArray<
        /**
         * According to the SQL standard,
         * a derived table may reference columns from
         * outer queries
         */
        | (
            FromClauseT["outerQueryJoins"] extends readonly IJoin[] ?
            FromClauseT["outerQueryJoins"] :
            never
        )
        /**
         * A lateral derived table may reference columns from
         * the same `FROM/JOIN` clause
         */
        | (
            AliasedTableT["isLateral"] extends true ?
            (
                FromClauseT["currentJoins"] extends readonly IJoin[] ?
                FromClauseT["currentJoins"] :
                never
            ) :
            never
        )
    >
);

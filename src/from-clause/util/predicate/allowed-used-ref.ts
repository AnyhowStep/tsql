import {IFromClause} from "../../from-clause";
import {IAliasedTable} from "../../../aliased-table";
import {IJoin} from "../../../join";
import {UsedRefUtil} from "../../../used-ref";

export type AllowedUsedRef<
    FromClauseT extends IFromClause,
    AliasedTableT extends Pick<IAliasedTable, "lateral">
> = (
    UsedRefUtil.FromJoinArray<
        /**
         * According to the SQL standard,
         * a derived table may reference columns from
         * parent queries
         */
        | (
            FromClauseT["parentJoins"] extends readonly IJoin[] ?
            FromClauseT["parentJoins"] :
            never
        )
        /**
         * A lateral derived table may reference columns from
         * the same `FROM/JOIN` clause
         */
        | (
            AliasedTableT["lateral"] extends true ?
            (
                FromClauseT["currentJoins"] extends readonly IJoin[] ?
                FromClauseT["currentJoins"] :
                never
            ) :
            never
        )
    >
);

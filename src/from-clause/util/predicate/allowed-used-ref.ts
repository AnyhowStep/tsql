import {IFromClause} from "../../from-clause";
import {IAliasedTable} from "../../../aliased-table";
import {IJoin} from "../../../join";
import {UsedRefUtil} from "../../../used-ref";
import {ColumnRefUtil} from "../../../column-ref";

export type AllowedJoinArray<
    FromClauseT extends IFromClause,
    AliasedTableT extends Pick<IAliasedTable, "isLateral">
> = (
    readonly (
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
    )[number][]
);
export type AllowedColumnRef<
    FromClauseT extends IFromClause,
    AliasedTableT extends Pick<IAliasedTable, "isLateral">
> = (
    ColumnRefUtil.FromJoinArray<
        AllowedJoinArray<FromClauseT, AliasedTableT>
    >
);
export type AllowedUsedRef<
    FromClauseT extends IFromClause,
    AliasedTableT extends Pick<IAliasedTable, "isLateral">
> = (
    UsedRefUtil.FromJoinArray<
        AllowedJoinArray<FromClauseT, AliasedTableT>
    >
);
export function allowedJoinArray<
    FromClauseT extends IFromClause,
    AliasedTableT extends Pick<IAliasedTable, "isLateral">
> (
    fromClause : FromClauseT,
    aliasedTable : AliasedTableT
) : (
    AllowedJoinArray<FromClauseT, AliasedTableT>
) {
    return [
        ...(
            (fromClause.outerQueryJoins != undefined) ?
            fromClause.outerQueryJoins :
            []
        ),
        ...(
            (aliasedTable.isLateral && fromClause.currentJoins != undefined) ?
            fromClause.currentJoins :
            []
        ),
    ];
}
export function allowedColumnRef<
    FromClauseT extends IFromClause,
    AliasedTableT extends Pick<IAliasedTable, "isLateral">
> (
    fromClause : FromClauseT,
    aliasedTable : AliasedTableT
) : (
    AllowedColumnRef<FromClauseT, AliasedTableT>
) {
    return ColumnRefUtil.fromJoinArray(
        allowedJoinArray(fromClause, aliasedTable)
    );
}

export function allowedUsedRef<
    FromClauseT extends IFromClause,
    AliasedTableT extends Pick<IAliasedTable, "isLateral">
> (
    fromClause : FromClauseT,
    aliasedTable : AliasedTableT
) : (
    AllowedUsedRef<FromClauseT, AliasedTableT>
) {
    return UsedRefUtil.fromJoinArray(
        allowedJoinArray(fromClause, aliasedTable)
    );
}

import {ITablePerType} from "../../table-per-type";
import {Query, QueryUtil} from "../../../unified-query";
import {IFromClause} from "../../../from-clause";
import {JoinUtil} from "../../../join";
import {findLastJoinToTable} from "../query";

export type From<TptT extends ITablePerType> =
    Query<{
        fromClause : IFromClause<{
            outerQueryJoins : undefined,
            currentJoins : readonly JoinUtil.FromAliasedTable<
                (
                    | TptT["childTable"]
                    | TptT["parentTables"][number]
                ),
                false
            >[],
        }>,
        selectClause : undefined,

        limitClause : undefined,

        compoundQueryClause : undefined,
        compoundQueryLimitClause : undefined,

        mapDelegate : undefined,
    }>
;

/**
 * This is used to implement a more efficient `fetchOne` operation.
 *
 * + Assumes `parentTables` has no duplicates.
 * + Assumes `childTable` is not in `parentTables`.
 * + Assumes any shared `columnAlias` between tables **must** have the same value.
 * + Assumes `joins` represents a valid inheritance graph.
 */
export function from<TptT extends ITablePerType> (
    tpt : TptT
) : From<TptT> {
    if (tpt.parentTables.length == 0) {
        return QueryUtil.newInstance()
            .from(tpt.childTable as any) as any;
    }

    let query : QueryUtil.AfterFromClause = QueryUtil.newInstance()
        .from(tpt.childTable as any);

    /**
     * We are iterating **backwards**.
     * This is intentional.
     */
    for (let i=tpt.parentTables.length-1; i>=0; --i) {
        const parent = tpt.parentTables[i];
        const [fromTableAlias, /* toTableAlias */] = findLastJoinToTable(tpt, parent.alias);
        query = QueryUtil.innerJoinUsingPrimaryKey(
            query,
            src => src[fromTableAlias],
            parent as any
        );
    }

    return query as From<TptT>;
}

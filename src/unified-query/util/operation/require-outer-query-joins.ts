import {IAliasedTable} from "../../../aliased-table";
import {FromClauseUtil} from "../../../from-clause";
import {IQuery} from "../../query";
import {Query} from "../../query-impl";

export type RequireOuterQueryJoins<
    QueryT extends IQuery,
    AliasedTablesT extends readonly IAliasedTable[]
> = (
    Query<{
        fromClause : FromClauseUtil.RequireOuterQueryJoins<QueryT["fromClause"], AliasedTablesT>,
        selectClause : QueryT["selectClause"],

        limitClause : QueryT["limitClause"],

        compoundQueryClause : QueryT["compoundQueryClause"],
        compoundQueryLimitClause : QueryT["compoundQueryLimitClause"],

        mapDelegate : QueryT["mapDelegate"],
        groupByClause : QueryT["groupByClause"],
    }>
);
export function requireOuterQueryJoins<
    QueryT extends IQuery,
    AliasedTablesT extends readonly IAliasedTable[]
> (
    query : QueryT,
    ...aliasedTables : (
        & AliasedTablesT
        & FromClauseUtil.AssertValidOuterQueryJoins<QueryT["fromClause"], AliasedTablesT>
    )
) : (
    RequireOuterQueryJoins<QueryT, AliasedTablesT>
) {
    const {
        //fromClause,
        selectClause,

        limitClause,

        compoundQueryClause,
        compoundQueryLimitClause,
        mapDelegate,
        groupByClause,
    } = query;

    const result : RequireOuterQueryJoins<QueryT, AliasedTablesT> = new Query(
        {
            fromClause : FromClauseUtil.requireOuterQueryJoins<
                QueryT["fromClause"],
                AliasedTablesT
            >(
                query.fromClause,
                ...(aliasedTables as any)
            ),
            selectClause,

            limitClause,

            compoundQueryClause,
            compoundQueryLimitClause,
            mapDelegate,
            groupByClause,
        },
        query
    );
    return result;
}

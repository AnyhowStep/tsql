import {IAliasedTable} from "../../../aliased-table";
import {FromClauseUtil} from "../../../from-clause";
import {IQuery} from "../../query";
import {Query} from "../../query-impl";

export type RequireNullableOuterQueryJoins<
    QueryT extends IQuery,
    AliasedTablesT extends readonly IAliasedTable[]
> = (
    Query<{
        fromClause : FromClauseUtil.RequireNullableOuterQueryJoins<QueryT["fromClause"], AliasedTablesT>,
        selectClause : QueryT["selectClause"],

        limitClause : QueryT["limitClause"],

        compoundQueryClause : QueryT["compoundQueryClause"],
        unionLimitClause : QueryT["unionLimitClause"],
    }>
);
export function requireNullableOuterQueryJoins<
    QueryT extends IQuery,
    AliasedTablesT extends readonly IAliasedTable[]
> (
    query : QueryT,
    ...aliasedTables : (
        & AliasedTablesT
        & FromClauseUtil.AssertValidOuterQueryJoins<QueryT["fromClause"], AliasedTablesT>
    )
) : (
    RequireNullableOuterQueryJoins<QueryT, AliasedTablesT>
) {
    const {
        //fromClause,
        selectClause,

        limitClause,

        compoundQueryClause,
        unionLimitClause,
    } = query;

    const result : RequireNullableOuterQueryJoins<QueryT, AliasedTablesT> = new Query(
        {
            fromClause : FromClauseUtil.requireNullableOuterQueryJoins<
                QueryT["fromClause"],
                AliasedTablesT
            >(
                query.fromClause,
                ...(aliasedTables as any)
            ),
            selectClause,

            limitClause,

            compoundQueryClause,
            unionLimitClause,
        },
        query
    );
    return result;
}

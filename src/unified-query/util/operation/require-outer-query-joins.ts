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

        unionClause : QueryT["unionClause"],
        unionLimitClause : QueryT["unionLimitClause"],
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

        unionClause,
        unionLimitClause,
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

            unionClause,
            unionLimitClause,
        },
        query
    );
    return result;
}

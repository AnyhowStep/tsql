import {SelectClause, SelectClauseUtil, SelectDelegate} from "../../../select-clause";
import {QueryBaseUtil} from "../../../query-base";
import {Query} from "../../query-impl";
import {BeforeUnionClause} from "../helper-type";

/**
 * https://github.com/microsoft/TypeScript/issues/32707#issuecomment-518347966
 *
 * This hack should only really be reserved for types that are more likely
 * to trigger max depth/max count errors.
 */
export type SelectImpl<
    SelectsT extends SelectClause,
    FromClauseT extends BeforeUnionClause["fromClause"],
    SelectClauseT extends BeforeUnionClause["selectClause"],
    LimitClauseT extends BeforeUnionClause["limitClause"],
    UnionClauseT extends BeforeUnionClause["compoundQueryClause"],
    UnionLimitClauseT extends BeforeUnionClause["compoundQueryLimitClause"],
> = (
    Query<{
        fromClause : FromClauseT,
        selectClause : SelectClauseUtil.Select<SelectClauseT, SelectsT>,

        limitClause : LimitClauseT,

        compoundQueryClause : UnionClauseT,
        compoundQueryLimitClause : UnionLimitClauseT,
    }>
);
export type Select<
    QueryT extends BeforeUnionClause,
    SelectsT extends SelectClause
> = (
    SelectImpl<
        SelectsT,
        QueryT["fromClause"],
        QueryT["selectClause"],
        QueryT["limitClause"],
        QueryT["compoundQueryClause"],
        QueryT["compoundQueryLimitClause"]
    >
);
export function select<
    QueryT extends BeforeUnionClause,
    SelectsT extends SelectClause
> (
    query : QueryT,
    selectDelegate : SelectDelegate<QueryT["fromClause"], QueryT["selectClause"], SelectsT>
) : (
    Select<QueryT, SelectsT>
) {
    if (!QueryBaseUtil.isBeforeUnionClause(query)) {
        throw new Error(`Cannot SELECT after UNION clause; this will change the number of columns`)
    }
    const selectClause = SelectClauseUtil.select<
        QueryT["fromClause"],
        QueryT["selectClause"],
        SelectsT
    >(
        query.fromClause,
        query.selectClause,
        selectDelegate
    );

    const {
        fromClause,
        //selectClause,

        limitClause,

        compoundQueryClause,
        compoundQueryLimitClause,
    } = query;

    const result : Select<QueryT, SelectsT> = new Query(
        {
            fromClause,
            selectClause,

            limitClause,

            compoundQueryClause,
            compoundQueryLimitClause,
        },
        query
    );
    return result;
}

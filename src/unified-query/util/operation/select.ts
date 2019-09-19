import {SelectClause, SelectClauseUtil, SelectDelegate} from "../../../select-clause";
import {QueryBaseUtil} from "../../../query-base";
import {Query} from "../../query-impl";
import {BeforeCompoundQueryClause} from "../helper-type";

/**
 * https://github.com/microsoft/TypeScript/issues/32707#issuecomment-518347966
 *
 * This hack should only really be reserved for types that are more likely
 * to trigger max depth/max count errors.
 */
export type SelectImpl<
    SelectsT extends SelectClause,
    FromClauseT extends BeforeCompoundQueryClause["fromClause"],
    SelectClauseT extends BeforeCompoundQueryClause["selectClause"],
    LimitClauseT extends BeforeCompoundQueryClause["limitClause"],
    CompoundQueryClauseT extends BeforeCompoundQueryClause["compoundQueryClause"],
    CompoundQueryLimitClauseT extends BeforeCompoundQueryClause["compoundQueryLimitClause"],
    MapDelegateT extends BeforeCompoundQueryClause["mapDelegate"],
> = (
    Query<{
        fromClause : FromClauseT,
        selectClause : SelectClauseUtil.Select<SelectClauseT, SelectsT>,

        limitClause : LimitClauseT,

        compoundQueryClause : CompoundQueryClauseT,
        compoundQueryLimitClause : CompoundQueryLimitClauseT,
        mapDelegate : MapDelegateT,
    }>
);
export type Select<
    QueryT extends BeforeCompoundQueryClause,
    SelectsT extends SelectClause
> = (
    SelectImpl<
        SelectsT,
        QueryT["fromClause"],
        QueryT["selectClause"],
        QueryT["limitClause"],
        QueryT["compoundQueryClause"],
        QueryT["compoundQueryLimitClause"],
        QueryT["mapDelegate"]
    >
);
export function select<
    QueryT extends BeforeCompoundQueryClause,
    SelectsT extends SelectClause
> (
    query : QueryT,
    selectDelegate : SelectDelegate<QueryT["fromClause"], QueryT["selectClause"], SelectsT>
) : (
    Select<QueryT, SelectsT>
) {
    if (!QueryBaseUtil.isBeforeCompoundQueryClause(query)) {
        throw new Error(`Cannot SELECT after COMPOUND QUERY clause; this will change the number of columns`);
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
        mapDelegate,
    } = query;

    const result : Select<QueryT, SelectsT> = new Query(
        {
            fromClause,
            selectClause,

            limitClause,

            compoundQueryClause,
            compoundQueryLimitClause,
            mapDelegate,
        },
        query
    );
    return result;
}

import {SelectClause, SelectClauseUtil, SelectDelegateColumns, SelectDelegateReturnType} from "../../../select-clause";
import {QueryBaseUtil} from "../../../query-base";
import {Query} from "../../query-impl";
import {BeforeCompoundQueryClause} from "../helper-type";
import {Correlate, correlate} from "./correlate";
import {BeforeSelectClause} from "../../../query-base/util";
import {GroupByClause} from "../../../group-by-clause";
import {IExprSelectItem} from "../../../expr-select-item";
import {BuiltInExprUtil} from "../../../built-in-expr";

/**
 * https://github.com/microsoft/TypeScript/issues/32707#issuecomment-518347966
 *
 * This hack should only really be reserved for types that are more likely
 * to trigger max depth/max count errors.
 */
export type SelectNoSelectClauseImpl<
    SelectsT extends SelectClause,
    FromClauseT extends BeforeCompoundQueryClause["fromClause"],
    LimitClauseT extends BeforeCompoundQueryClause["limitClause"],
    CompoundQueryClauseT extends BeforeCompoundQueryClause["compoundQueryClause"],
    CompoundQueryLimitClauseT extends BeforeCompoundQueryClause["compoundQueryLimitClause"],
    MapDelegateT extends BeforeCompoundQueryClause["mapDelegate"],
    GroupByClauseT extends BeforeCompoundQueryClause["groupByClause"],
> = (
    Query<{
        fromClause : FromClauseT,
        selectClause : SelectsT,

        limitClause : LimitClauseT,

        compoundQueryClause : CompoundQueryClauseT,
        compoundQueryLimitClause : CompoundQueryLimitClauseT,
        mapDelegate : MapDelegateT,
        groupByClause : GroupByClauseT,
    }>
);
export type SelectNoSelectClause<
    QueryT extends BeforeCompoundQueryClause & BeforeSelectClause,
    SelectsT extends SelectClause
> = (
    SelectNoSelectClauseImpl<
        SelectsT,
        QueryT["fromClause"],
        QueryT["limitClause"],
        QueryT["compoundQueryClause"],
        QueryT["compoundQueryLimitClause"],
        QueryT["mapDelegate"],
        QueryT["groupByClause"]
    >
);

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
    GroupByClauseT extends BeforeCompoundQueryClause["groupByClause"],
> = (
    Query<{
        fromClause : FromClauseT,
        selectClause : SelectClauseUtil.Select<SelectClauseT, SelectsT>,

        limitClause : LimitClauseT,

        compoundQueryClause : CompoundQueryClauseT,
        compoundQueryLimitClause : CompoundQueryLimitClauseT,
        mapDelegate : MapDelegateT,
        groupByClause : (
            GroupByClauseT extends GroupByClause ?
            GroupByClauseT :
            (
                true extends Extract<SelectsT[number], IExprSelectItem>["isAggregate"] ?
                [] :
                undefined
            )
        ),
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
        QueryT["mapDelegate"],
        QueryT["groupByClause"]
    >
);

export type QuerySelectDelegate<
    QueryT extends BeforeCompoundQueryClause,
    SelectsT extends SelectClause
> =
    (
        columns : SelectDelegateColumns<QueryT["fromClause"]>,
        subquery : Correlate<QueryT>
    ) => SelectDelegateReturnType<QueryT["fromClause"], QueryT["groupByClause"], QueryT["selectClause"], SelectsT>
;

export function select<
    QueryT extends BeforeCompoundQueryClause,
    SelectsT extends SelectClause
> (
    query : QueryT,
    selectDelegate : QuerySelectDelegate<QueryT, SelectsT>
    //selectDelegate : SelectDelegate<QueryT["fromClause"], QueryT["selectClause"], SelectsT>
) : (
    Select<QueryT, SelectsT>
) {
    if (!QueryBaseUtil.isBeforeCompoundQueryClause(query)) {
        throw new Error(`Cannot SELECT after COMPOUND QUERY clause; this will change the number of columns`);
    }
    //const correlated = correlate<QueryT>(query);

    const selectClause = SelectClauseUtil.select<
        QueryT["fromClause"],
        QueryT["groupByClause"],
        QueryT["selectClause"],
        SelectsT
    >(
        query.fromClause,
        query.groupByClause,
        query.selectClause,
        (columns) => {
            return selectDelegate(columns, correlate<QueryT>(query));
        }
    );

    const {
        fromClause,
        //selectClause,

        limitClause,

        compoundQueryClause,
        compoundQueryLimitClause,
        mapDelegate,
        groupByClause,
    } = query;

    const result : Select<QueryT, SelectsT> = new Query(
        {
            fromClause,
            selectClause,

            limitClause,

            compoundQueryClause,
            compoundQueryLimitClause,
            mapDelegate,
            groupByClause : (
                groupByClause != undefined ?
                groupByClause :
                selectClause.some(selectItem => (
                    BuiltInExprUtil.isBuiltInExpr(selectItem) &&
                    BuiltInExprUtil.isAggregate(selectItem)
                )) ?
                [] :
                undefined
            ) as (
                QueryT["groupByClause"] extends GroupByClause ?
                QueryT["groupByClause"] :
                (
                    true extends Extract<SelectsT[number], IExprSelectItem>["isAggregate"] ?
                    [] :
                    undefined
                )
            ),
        },
        query
    );
    return result;
}

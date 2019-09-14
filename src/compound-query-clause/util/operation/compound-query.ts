import {SelectClause, SelectClauseUtil} from "../../../select-clause";
import {CompoundQueryType} from "../../../compound-query";
import {CompoundQueryClause} from "../../compound-query-clause";
import {QueryBaseUtil} from "../../../query-base";
import {AssertNonUnion} from "../../../type-util";
import {AssertCompatible, assertCompatible} from "../predicate";
import {IFromClause} from "../../../from-clause";

/**
 *
 * @todo `targetQuery` must contain subset of outer query joins
 */
export function compoundQuery<
    FromClauseT extends Pick<IFromClause, "outerQueryJoins">,
    SelectClauseT extends SelectClause,
    TargetQueryT extends QueryBaseUtil.AfterSelectClause
> (
    fromClause : FromClauseT,
    selectClause : SelectClauseT & AssertNonUnion<SelectClauseT>,
    compoundQueryClause : CompoundQueryClause|undefined,
    compoundQueryType : CompoundQueryType,
    isDistinct : boolean,
    targetQuery : (
        & TargetQueryT
        & AssertCompatible<FromClauseT, SelectClauseT, TargetQueryT>
    )
) : (
    {
        /**
         * We only need to `LeftCompound` because we already asserted
         * that both `SELECT` clauses have the same length.
         */
        selectClause : SelectClauseUtil.LeftCompound<
            SelectClauseT,
            TargetQueryT["selectClause"]
        >,
        compoundQueryClause : CompoundQueryClause,
    }
) {
    assertCompatible(fromClause, selectClause, targetQuery);

    return {
        selectClause : SelectClauseUtil.leftCompound(
            selectClause,
            targetQuery.selectClause
        ),
        compoundQueryClause : [
            ...(
                compoundQueryClause == undefined ?
                [] :
                compoundQueryClause
            ),
            {
                compoundQueryType,
                isDistinct,
                query : targetQuery,
            }
        ]
    };
}

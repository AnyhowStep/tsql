import {IQueryBase} from "../../../../query-base";
import {LimitClauseUtil} from "../../../../limit-clause";

/**
 * We use `LIMIT 2`,
 * because if we fetch more than one row,
 * we've messed up.
 *
 * But I don't want to fetch 1 million rows if we mess up.
 * This limits our failure.
 *
 * @todo Better naming
 */
export function trySetLimit2<QueryT extends IQueryBase> (query : QueryT) : QueryT {
    const limitedQuery : QueryT = (
        query.compoundQueryClause == undefined ?
        (
            query.limitClause == undefined ?
            {
                ...query,
                limitClause : LimitClauseUtil.limitNumber(undefined, 2),
            } :
            /**
             * The user already specified a custom limit.
             * We don't want to mess with it.
             *
             * @todo Decide if we **should** mess with it anyway?
             * If they set it to `LIMIT 0/1/2`, there's no real reason to mess with it.
             * But any higher?
             *
             * An explicit `LIMIT 1000000` can safely be changed to `LIMIT 2`, though.
             */
            query
        ) :
        (
            query.compoundQueryLimitClause == undefined ?
            {
                ...query,
                compoundQueryLimitClause : LimitClauseUtil.limitNumber(undefined, 2),
            } :
            /**
             * The user already specified a custom limit.
             * We don't want to mess with it.
             *
             * @todo Decide if we **should** mess with it anyway?
             * If they set it to `LIMIT 0/1/2`, there's no real reason to mess with it.
             * But any higher?
             *
             * An explicit `LIMIT 1000000` can safely be changed to `LIMIT 2`, though.
             */
            query
        )
    );
    return limitedQuery;
}

import {QueryBaseData, IQueryBase} from "../query-base";
import {WhereClause} from "../where-clause";
import {GroupByClause} from "../group-by-clause";
import {HavingClause} from "../having-clause";
import {OrderByClause} from "../order-by-clause";
import {UnionOrderByClause} from "../union-order-by-clause";

/**
 * @todo Rename to `UnifiedQueryData` or something
 */
export interface QueryData extends QueryBaseData {
}
/**
 * @todo Rename to `ExtraUnifiedQueryData` or something
 */
export interface ExtraQueryData {
    readonly whereClause : WhereClause|undefined,
    readonly groupByClause : GroupByClause|undefined,
    readonly havingClause : HavingClause|undefined,
    readonly orderByClause : OrderByClause|undefined,
    readonly compoundQueryOrderByClause : UnionOrderByClause|undefined,
}

/**
 * @todo Rename to `IUnifiedQuery` or something
 */
export interface IQuery<DataT extends QueryData=QueryData> extends IQueryBase<DataT> {
}

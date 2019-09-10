import {IFromClause} from "../from-clause";
import {SelectClause} from "../select-clause";
import {UnionClause} from "../union-clause";
import {LimitClause} from "../limit-clause";
import {WhereClause} from "../where-clause";
import {GroupByClause} from "../group-by-clause";
import {HavingClause} from "../having-clause";
import {OrderByClause} from "../order-by-clause";

export interface QueryBaseData {
    readonly fromClause : IFromClause,
    readonly selectClause : SelectClause|undefined,

    readonly limitClause : LimitClause|undefined,

    readonly unionClause : UnionClause|undefined,
    readonly unionLimitClause : LimitClause|undefined,

}

/**
 * All database-specific libraries should implement this interface.
 */
export interface IQueryBase<DataT extends QueryBaseData=QueryBaseData> {
    readonly fromClause : DataT["fromClause"],
    readonly selectClause : DataT["selectClause"],

    readonly limitClause : DataT["limitClause"],

    readonly unionClause : DataT["unionClause"],
    readonly unionLimitClause : DataT["unionLimitClause"],

    readonly whereClause : WhereClause|undefined,
    readonly groupByClause : GroupByClause|undefined,
    readonly havingClause : HavingClause|undefined,
    readonly orderByClause : OrderByClause|undefined,
}

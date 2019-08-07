import {IFromClause} from "../from-clause";
import {SelectClause} from "../select-clause";
import {UnionClause} from "../union-clause";
import {LimitData} from "../limit";
import {Ast} from "../ast";

export interface QueryBaseData {
    readonly fromClause : IFromClause,
    readonly selectClause : SelectClause|undefined,

    readonly limitClause : LimitData|undefined,

    readonly unionClause : UnionClause|undefined,
    readonly unionLimitClause : LimitData|undefined,

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

    /**
     * Used to convert the query into an AST
     * for use as an `IExpr`.
     */
    readonly buildExprAst : () => Ast;
}

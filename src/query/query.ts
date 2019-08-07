import {IFromClause} from "../from-clause";
import {SelectClause} from "../select-clause";
import {UnionClause} from "../union-clause";
import {LimitData} from "../limit";
import {Ast} from "../ast";

export interface QueryData {
    readonly fromClause : IFromClause,
    readonly selectClause : SelectClause|undefined,

    readonly limitClause : LimitData|undefined,

    readonly unionClause : UnionClause|undefined,
    readonly unionLimitClause : LimitData|undefined,

}

export interface IQuery<DataT extends QueryData=QueryData> {
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

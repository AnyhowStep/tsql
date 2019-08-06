import * as tm from "type-mapping";
import {Ast} from "../ast";
import {IUsedRef} from "../used-ref";

export interface ExprData {
    readonly mapper : tm.AnySafeMapper;
    readonly usedRef : IUsedRef;
}

export interface IExpr<DataT extends ExprData=ExprData> {
    /**
     * The mapper that validates/converts raw values for use
     */
    readonly mapper : DataT["mapper"];
    /**
     * The columns used by this expression.
     * ```sql
     * SELECT
     *  --The `usedRef` of this expression are the two columns involved
     *  (myTable.myColumn + otherTable.otherColumn)
     * FROM
     *  myTable
     * JOIN
     *  otherTable
     * ON
     *  myTable.id = otherTable.id
     * ```
     */
    readonly usedRef : DataT["usedRef"];

    /**
     * The AST of the expression
     */
    readonly ast : Ast;
}

export type IAnonymousExpr<TypeT> = (
    IExpr<{
        mapper : tm.SafeMapper<TypeT>,
        usedRef : IUsedRef,
    }>
);

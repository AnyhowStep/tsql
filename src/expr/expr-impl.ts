import * as tm from "type-mapping";
import {ExprData, IExpr} from "./expr";
import {Ast, parentheses} from "../ast";
import {ColumnMap} from "../column-map";
import {SortDirection} from "../sort-direction";
import * as ExprUtil from "./util";
import {IUsedRef} from "../used-ref";

/**
 * https://github.com/microsoft/TypeScript/issues/32707#issuecomment-518347966
 *
 * This hack should only really be reserved for types that are more likely
 * to trigger max depth/max count errors.
 */
export class ExprImpl<
    MapperT extends ExprData["mapper"],
    UsedRefT extends ExprData["usedRef"]
> implements IExpr<{
    mapper : MapperT,
    usedRef : UsedRefT,
}> {
    readonly mapper : MapperT;
    readonly usedRef : UsedRefT;

    readonly ast : Ast;

    public constructor (
        data : {
            mapper : MapperT,
            usedRef : UsedRefT,
        },
        ast : Ast
    ) {
        this.mapper = data.mapper;
        this.usedRef = data.usedRef;

        //Gotta' play it safe.
        //We want to preserve the order of operations.
        this.ast = parentheses(ast);
    }

    /**
     * If you are running into "max instantiation depth" errors,
     * consider adding explicit `TableExpr<>` type annotations.
     *
     * If that doesn't help,
     * consider using `ExprUtil.as()` instead.
     *
     * Also, consider reading this to understand my frustration,
     * https://github.com/microsoft/TypeScript/issues/29511
     *
     * @param alias
     */
    as <AliasT extends string> (
        alias : AliasT
    ) : ExprUtil.As<this, AliasT> {
        return ExprUtil.as(this, alias);
    }

    /**
     * ```sql
     * ORDER BY
     *  RAND() ASC
     * ```
     */
    asc () : ExprUtil.Asc<this> {
        return ExprUtil.asc(this);
    }
    /**
     * ```sql
     * ORDER BY
     *  RAND() DESC
     * ```
     */
    desc () : ExprUtil.Desc<this> {
        return ExprUtil.desc(this);
    }
    /**
     * ```sql
     * ORDER BY
     *  (myTable.myColumn IS NOT NULL) ASC,
     *  RAND() DESC
     * ```
     */
    sort (sortDirection : SortDirection) : ExprUtil.Sort<this> {
        return ExprUtil.sort(this, sortDirection);
    }
}
export type Expr<DataT extends ExprData> =
    ExprImpl<
        DataT["mapper"],
        DataT["usedRef"]
    >
;
export function expr<DataT extends ExprData> (
    data : DataT,
    ast : Ast
) : (
    Expr<DataT>
) {
    return new ExprImpl(data, ast);
}
// export class Expr<DataT extends ExprData> implements IExpr<DataT> {
//     readonly mapper : DataT["mapper"];
//     readonly usedRef : DataT["usedRef"];

//     readonly ast : Ast;

//     public constructor (
//         data : DataT,
//         ast : Ast
//     ) {
//         this.mapper = data.mapper;
//         this.usedRef = data.usedRef;

//         //Gotta' play it safe.
//         //We want to preserve the order of operations.
//         this.ast = parentheses(ast);
//     }

//     /**
//      * If you are running into "max instantiation depth" errors,
//      * consider adding explicit `TableExpr<>` type annotations.
//      *
//      * If that doesn't help,
//      * consider using `ExprUtil.as()` instead.
//      *
//      * Also, consider reading this to understand my frustration,
//      * https://github.com/microsoft/TypeScript/issues/29511
//      *
//      * @param alias
//      */
//     as <AliasT extends string> (
//         alias : AliasT
//     ) : ExprUtil.As<this, AliasT> {
//         return ExprUtil.as(this, alias);
//     }

//     /**
//      * ```sql
//      * ORDER BY
//      *  RAND() ASC
//      * ```
//      */
//     asc () : ExprUtil.Asc<this> {
//         return ExprUtil.asc(this);
//     }
//     /**
//      * ```sql
//      * ORDER BY
//      *  RAND() DESC
//      * ```
//      */
//     desc () : ExprUtil.Desc<this> {
//         return ExprUtil.desc(this);
//     }
//     /**
//      * ```sql
//      * ORDER BY
//      *  (myTable.myColumn IS NOT NULL) ASC,
//      *  RAND() DESC
//      * ```
//      */
//     sort (sortDirection : SortDirection) : ExprUtil.Sort<this> {
//         return ExprUtil.sort(this, sortDirection);
//     }
// }

/**
 * This is useful for avoiding "max instantiation depth" problems.
 * It also speeds up type checking.
 *
 * As much as possible, **DO NOT** let `tsc/tsserver` infer
 * the type of `expr`.
 *
 * Just bite the bullet and add these explicit type annotations.
 *
 * Example:
 *
 * ```ts
 *  const expr : tsql.TableExpr<typeof myTable, bigint> = (
 *      tsql.requireParentJoins(myTable)
 *          .from(otherTable)
 *          .where(c => tsql.eq(c.myTable.myColumn, c.otherTable.otherColumn))
 *          .select(c => [otherTable.amount])
 *          .limit(1)
 *          .coalesce(null)
 *  );
 * ```
 *
 * Or,
 * ```ts
 *  function amount () : tsql.TableExpr<typeof myTable, bigint> {
 *      return tsql.requireParentJoins(myTable)
 *          .from(otherTable)
 *          .where(c => tsql.eq(c.myTable.myColumn, c.otherTable.otherColumn))
 *          .select(c => [otherTable.amount])
 *          .limit(1)
 *          .coalesce(null)
 *  }
 * ```
 */
export type TableExpr<
    TableT extends { tableAlias : string, columns : ColumnMap },
    TypeT
> = (
    Expr<{
        mapper : tm.SafeMapper<TypeT>,
        /**
         * @todo Change this to `UsedRefUtil.FromTable<>` ?
         */
        usedRef : IUsedRef<{
            [alias in TableT["tableAlias"]] : TableT["columns"]
        }>,
    }>
);

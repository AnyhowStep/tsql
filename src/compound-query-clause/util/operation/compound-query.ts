import * as tm from "type-mapping";
import {SelectClause} from "../../../select-clause";
import {CompoundQueryType} from "../../../compound-query";
import {CompoundQueryClause} from "../../compound-query-clause";
import {IColumn} from "../../../column";
import {IExprSelectItem} from "../../../expr-select-item";
import {ColumnMap} from "../../../column-map";
import {ColumnRef} from "../../../column-ref";
import {QueryUtil} from "../../../unified-query";
import {CompileError} from "../../../compile-error";
import {AssertNonUnion, IsStrictSameType, ToUnknownIfAllPropertiesNever, Merge} from "../../../type-util";

export type FindItemCompatibilityError<
    IdentifierT extends Record<PropertyKey, PropertyKey>,
    A extends { mapper : tm.AnyMapper },
    B extends { mapper : tm.AnyMapper }
> =
    tm.OutputOf<B["mapper"]> extends tm.OutputOf<A["mapper"]> ?
    never :
    CompileError<[
        "Expected",
        IdentifierT,
        "to be subtype of",
        tm.OutputOf<A["mapper"]>,
        "received",
        tm.OutputOf<B["mapper"]>
    ]>
;
export type FindMapCompatibilityError<
    IdentifierT extends Record<PropertyKey, PropertyKey>,
    A extends ColumnMap,
    B extends ColumnMap
> =
    Exclude<keyof A, keyof B> extends never ?
    (
        Exclude<keyof B, keyof A> extends never ?
        {
            [columnAlias in (keyof A)&(keyof B)] : (
                FindItemCompatibilityError<
                    Merge<IdentifierT & { columnAlias : columnAlias }>,
                    A[columnAlias],
                    B[columnAlias]
                >
            )
        }[(keyof A)&(keyof B)] :
        CompileError<[
            IdentifierT,
            "has extra columns",
            Exclude<keyof B, keyof A>
        ]>
    ) :
    CompileError<[
        "Expected",
        IdentifierT,
        "to have columns",
        Exclude<keyof A, keyof B>
    ]>
;
export type FindRefCompatibilityError<
    IdentifierT extends Record<PropertyKey, PropertyKey>,
    A extends ColumnRef,
    B extends ColumnRef
> =
    Exclude<keyof A, keyof B> extends never ?
    (
        Exclude<keyof B, keyof A> extends never ?
        {
            [tableAlias in (keyof A)&(keyof B)] : (
                FindMapCompatibilityError<
                    Merge<IdentifierT & { tableAlias : tableAlias }>,
                    A[tableAlias],
                    B[tableAlias]
                >
            )
        }[(keyof A)&(keyof B)] :
        CompileError<[
            IdentifierT,
            "has extra tables",
            Exclude<keyof B, keyof A>
        ]>
    ) :
    CompileError<[
        "Expected",
        IdentifierT,
        "to have tables",
        Exclude<keyof A, keyof B>
    ]>
;
/**
 * @todo Consider allowing nullable columns to be compounded with non-nullable columns.
 * This will require modifying the type of the original `SELECT` clause.
 */
type AssertCompoundQueryCompatible<
    A extends SelectClause,
    B extends SelectClause
> =
    number extends A["length"] ?
    CompileError<["Cannot compare to invalid SELECT clause length", A["length"]]> :
    IsStrictSameType<A["length"], B["length"]> extends false ?
    CompileError<["SELECT clause length mismatch; expected", A["length"], "received", B["length"]]> :
    ToUnknownIfAllPropertiesNever<{
        [index in (keyof A)&(keyof B)] : (
            A[index] extends IColumn|IExprSelectItem ?
            (
                B[index] extends IColumn|IExprSelectItem ?
                FindItemCompatibilityError<{ index : index }, A[index], B[index]> :
                CompileError<["Expected index", index, "to be Column or ExprSelectItem"]>
            ) :
            A[index] extends ColumnMap ?
            (
                B[index] extends ColumnMap ?
                FindMapCompatibilityError<{ index : index }, A[index], B[index]> :
                CompileError<["Expected index", index, "to be ColumnMap"]>
            ) :
            A[index] extends ColumnRef ?
            (
                B[index] extends ColumnRef ?
                FindRefCompatibilityError<{ index : index }, A[index], B[index]> :
                CompileError<["Expected index", index, "to be ColumnRef"]>
            ) :
            never
        )
    }>
;

export function compoundQuery<
    SelectClauseT extends SelectClause,
    QueryT extends QueryUtil.AfterSelectClause
> (
    selectClause : SelectClauseT & AssertNonUnion<SelectClauseT>,
    compoundQueryClause : CompoundQueryClause|undefined,
    compoundQueryType : CompoundQueryType,
    isDistinct : boolean,
    query : (
        & QueryT
        & AssertCompoundQueryCompatible<SelectClauseT, QueryT["selectClause"]>
    )
) : (
    {
        selectClause : SelectClauseT,
        compoundQueryClause : CompoundQueryClause,
    }
) {
    selectClause;
    compoundQueryClause;
    compoundQueryType;
    isDistinct;
    query;
    return null as any;
}

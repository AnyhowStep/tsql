import * as tm from "type-mapping";
import {SelectClause} from "../../../select-clause";
import {IColumn, ColumnUtil} from "../../../column";
import {IExprSelectItem, ExprSelectItemUtil} from "../../../expr-select-item";
import {ColumnMap, ColumnMapUtil} from "../../../column-map";
import {ColumnRef, ColumnRefUtil} from "../../../column-ref";
import {CompileError} from "../../../compile-error";
import {IsStrictSameType, ToUnknownIfAllPropertiesNever, Merge} from "../../../type-util";

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
export type AssertSelectClauseCompatible<
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

export function assertMapCompatibilityError (identifier : (string|number)[], a : ColumnMap, b : ColumnMap) {
    const aColumnAliases = Object.keys(a);
    const bColumnAliases = Object.keys(b);

    const missingColumnAliases = aColumnAliases.filter(columnAlias => !bColumnAliases.includes(columnAlias));
    if (missingColumnAliases.length > 0) {
        throw new Error(`Expected ${identifier.join(" ")} to have columns ${missingColumnAliases.join(", ")}`);
    }

    const extraColumnAliases = bColumnAliases.filter(columnAlias => !aColumnAliases.includes(columnAlias));
    if (extraColumnAliases.length > 0) {
        throw new Error(`${identifier.join(" ")} has extra columns ${extraColumnAliases.join(", ")}`);
    }

    /**
     * Can't check subtype requirement during run-time
     */
}

export function assertRefCompatibilityError (identifier : (string|number)[], a : ColumnRef, b : ColumnRef) {
    const aTableAliases = Object.keys(a);
    const bTableAliases = Object.keys(b);

    const missingTableAliases = aTableAliases.filter(tableAlias => !bTableAliases.includes(tableAlias));
    if (missingTableAliases.length > 0) {
        throw new Error(`Expected ${identifier.join(" ")} to have tables ${missingTableAliases.join(", ")}`);
    }

    const extraTableAliases = bTableAliases.filter(tableAlias => !aTableAliases.includes(tableAlias));
    if (extraTableAliases.length > 0) {
        throw new Error(`${identifier.join(" ")} has extra tables ${extraTableAliases.join(", ")}`);
    }

    for (const tableAlias of aTableAliases) {
        assertMapCompatibilityError(
            [...identifier, "table", tableAlias],
            a[tableAlias],
            b[tableAlias]
        );
    }
}

export function assertSelectClauseCompatible (
    a : SelectClause,
    b : SelectClause
) {
    if (a.length != b.length) {
        throw new Error(`SELECT clause length mismatch; expected ${a.length} received ${b.length}`);
    }
    for (let index=0; index<a.length; ++index) {
        const itemA = a[index];
        const itemB = b[index];
        if (ColumnUtil.isColumn(itemA) || ExprSelectItemUtil.isExprSelectItem(itemA)) {
            if (ColumnUtil.isColumn(itemB) || ExprSelectItemUtil.isExprSelectItem(itemB)) {
                /**
                 * Can't check subtype requirement during run-time
                 */
            } else {
                throw new Error(`Expected index ${index} to be Column or ExprSelectItem`);
            }
        } else if (ColumnMapUtil.isColumnMap(itemA)) {
            if (ColumnMapUtil.isColumnMap(itemB)) {
                assertMapCompatibilityError(
                    ["index", index],
                    itemA,
                    itemB
                );
            } else {
                throw new Error(`Expected index ${index} to be ColumnMap`);
            }
        } else if (ColumnRefUtil.isColumnRef(itemA)) {
            if (ColumnRefUtil.isColumnRef(itemB)) {
                assertRefCompatibilityError(
                    ["index", index],
                    itemA,
                    itemB
                );
            } else {
                throw new Error(`Expected index ${index} to be ColumnRef`);
            }
        } else {
            throw new Error(`Unknown SELECT item at index ${index}`);
        }
    }
}

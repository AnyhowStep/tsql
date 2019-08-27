import {SelectItem} from "../../../select-item";
import {ToUnknownIfAllPropertiesNever} from "../../../type-util";
import {SelectClause} from "../../select-clause";
import {ColumnIdentifierUtil, ColumnIdentifierArrayUtil} from "../../../column-identifier";
import {CompileError} from "../../../compile-error";

type AssertDisjointColumnIdentifier<
    SelectClauseT extends SelectClause|undefined,
    SelectsT extends SelectClause
> =
    SelectClauseT extends SelectClause ?
    (
        Extract<
            ColumnIdentifierUtil.FromSelectItem<SelectsT[number]>,
            ColumnIdentifierUtil.FromSelectItem<SelectClauseT[number]>
        > extends never ?
        unknown :
        CompileError<[
            "Identifiers already used in SELECT clause; consider aliasing",
            ColumnIdentifierUtil.ToErrorMessageFriendlyType<
                Extract<
                    ColumnIdentifierUtil.FromSelectItem<SelectsT[number]>,
                    ColumnIdentifierUtil.FromSelectItem<SelectClauseT[number]>
                >
            >
        ]>
    ) :
    unknown
;

type ExtractSelectItemNotAtIndex<
    SelectsT extends SelectClause,
    IndexT extends keyof SelectsT
> =
    {
        [index in Extract<keyof SelectsT, string>] : (
            index extends IndexT ?
            never :
            SelectsT[index] extends SelectItem ?
            SelectsT[index] :
            never
        )
    }[Extract<keyof SelectsT, string>]
;

/**
 * + Assumes `SelectsT` is a non-empty tuple
 */
type AssertNoDuplicateColumnIdentifier<
    SelectsT extends SelectClause
> =
    ToUnknownIfAllPropertiesNever<{
        [index in Extract<keyof SelectsT, string>] : (
            SelectsT[index] extends SelectItem ?
            (
                Extract<
                    ColumnIdentifierUtil.FromSelectItem<SelectsT[index]>,
                    ColumnIdentifierUtil.FromSelectItem<ExtractSelectItemNotAtIndex<SelectsT, index>>
                > extends never ?
                never :
                CompileError<[
                    "Duplicate identifiers in SELECT clause not allowed; consider aliasing",
                    ColumnIdentifierUtil.ToErrorMessageFriendlyType<
                        Extract<
                            ColumnIdentifierUtil.FromSelectItem<SelectsT[index]>,
                            ColumnIdentifierUtil.FromSelectItem<ExtractSelectItemNotAtIndex<SelectsT, index>>
                        >
                    >
                ]>
            ) :
            never
        )
    }>
;

export type AssertValidColumnIdentifier<
    SelectClauseT extends SelectClause|undefined,
    SelectsT extends SelectClause
> =
    /**
     * @todo Assert that `IExprSelectItem` do not shadow/hide
     * column identifiers from `FROM` clause?
     *
     * Not a priority at the moment because I'm assuming no one
     * would reasonably have a `tableAlias` with a value of `typeof ALIASED`.
     *
     * If such a thing were to happen, we'd have to also check that
     * `FROM/JOIN`s do not shadow `IExprSelectItem` identifiers in the
     * `SELECT` clause.
     *
     * Or disallow `FROM/JOIN` after a `SELECT` with an `IExprSelectItem`.
     *
     * This would make life a pain.
     */
    & AssertDisjointColumnIdentifier<SelectClauseT, SelectsT>
    & AssertNoDuplicateColumnIdentifier<SelectsT>
;

export function assertValidColumnIdentifier (
    selectClause : SelectClause|undefined,
    selects : SelectClause
) {
    const selectsIdentifiers = ColumnIdentifierUtil.fromSelectClause(selects);
    ColumnIdentifierArrayUtil.assertNoDuplicate(
        selectsIdentifiers
    );

    if (selectClause != undefined) {
        const selectClauseIdentifiers = ColumnIdentifierUtil.fromSelectClause(selectClause);
        ColumnIdentifierArrayUtil.assertDisjoint(
            selectClauseIdentifiers,
            selectsIdentifiers
        );
    }
}

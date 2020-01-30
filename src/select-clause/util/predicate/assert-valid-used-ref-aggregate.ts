import {SelectClause} from "../../select-clause";
import {IFromClause} from "../../../from-clause";
import {ToUnknownIfAllPropertiesNever, ToNeverIfUnknown, AssertNonUnion} from "../../../type-util";
import {IExprSelectItem, ExprSelectItemUtil} from "../../../expr-select-item";
import {UsedRefUtil} from "../../../used-ref";
import {AllowedUsedRef, allowedColumnRef} from "../query";

type AssertValidExprSelectItemUsedRef_Aggregate<
    FromClauseT extends IFromClause,
    SelectsT extends SelectClause
> =
    ToUnknownIfAllPropertiesNever<{
        [index in Extract<keyof SelectsT, string>] : (
            SelectsT[index] extends IExprSelectItem ?
            (
                SelectsT[index]["isAggregate"] extends true ?
                ToNeverIfUnknown<
                    & AssertNonUnion<SelectsT[index]>
                    & UsedRefUtil.AssertAllowed<
                        AllowedUsedRef<FromClauseT>,
                        SelectsT[index]["usedRef"]
                    >
                > :
                never
            ) :
            never
        )
    }>
;

export type AssertValidUsedRef_Aggregate<
    FromClauseT extends IFromClause,
    SelectsT extends SelectClause
> =
    & AssertValidExprSelectItemUsedRef_Aggregate<FromClauseT, SelectsT>
;
export function assertValidUsedRef_Aggregate (
    fromClause : IFromClause,
    selects : SelectClause
) {
    const columns = allowedColumnRef(fromClause);
    for (const selectItem of selects) {
        if (ExprSelectItemUtil.isExprSelectItem(selectItem)) {
            if (selectItem.isAggregate) {
                UsedRefUtil.assertAllowed(
                    { columns },
                    selectItem.usedRef
                );
            }
        }
    }
}

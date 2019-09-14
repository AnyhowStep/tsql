import {SelectClause} from "../../select-clause";
import {SelectItemUtil, SelectItem} from "../../../select-item";

export type ColumnAlias<SelectClauseT extends SelectClause> =
    {
        [index in Extract<keyof SelectClauseT, string>] : (
            SelectClauseT[index] extends SelectItem ?
            SelectItemUtil.ColumnAlias<SelectClauseT[index]> :
            never
        )
    }[Extract<keyof SelectClauseT, string>]
;

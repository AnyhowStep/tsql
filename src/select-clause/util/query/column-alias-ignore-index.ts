import {SelectClause} from "../../select-clause";
import {SelectItemUtil, SelectItem} from "../../../select-item";

export type ColumnAliasIgnoreIndex<SelectClauseT extends SelectClause, IgnoreT extends keyof SelectClauseT> =
    {
        [index in Extract<keyof SelectClauseT, string>] : (
            index extends IgnoreT ?
            never :
            SelectClauseT[index] extends SelectItem ?
            SelectItemUtil.ColumnAlias<SelectClauseT[index]> :
            never
        )
    }[Extract<keyof SelectClauseT, string>]
;

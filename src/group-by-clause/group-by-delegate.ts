import {IFromClause} from "../from-clause";
import {SelectClause} from "../select-clause";
import {ColumnIdentifierRefUtil} from "../column-identifier-ref";
import {ColumnIdentifierUtil} from "../column-identifier";
import * as GroupByClauseUtil from "./util";

export type GroupByDelegate<
    FromClauseT extends IFromClause,
    SelectClauseT extends SelectClause|undefined
> = (
    (
        columns : ColumnIdentifierRefUtil.TryFlatten<
            GroupByClauseUtil.AllowedColumnIdentifierRef<FromClauseT, SelectClauseT>
        >
    ) => (
        & ColumnIdentifierUtil.FromColumnRef<
            GroupByClauseUtil.AllowedColumnIdentifierRef<FromClauseT, SelectClauseT>
        >[]
        /**
         * Must be non-empty tuple
         */
        & { "0" : unknown }
    )
);

import {FromClauseUtil} from "../from-clause";
import {ColumnIdentifierRefUtil} from "../column-identifier-ref";
import {ColumnIdentifierUtil} from "../column-identifier";
import * as GroupByClauseUtil from "./util";

export type GroupByDelegate<
    FromClauseT extends FromClauseUtil.AfterFromClause,
    GroupByT extends readonly ColumnIdentifierUtil.FromColumnRef<
        GroupByClauseUtil.AllowedColumnIdentifierRef<FromClauseT>
    >[]
> = (
    (
        columns : ColumnIdentifierRefUtil.TryFlatten<
            GroupByClauseUtil.AllowedColumnIdentifierRef<FromClauseT>
        >
    ) => GroupByT
);

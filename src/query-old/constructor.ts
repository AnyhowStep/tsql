import {IJoin} from "../join";
import {SelectItem} from "../select-item";
import {IAnonymousExpr} from "../expr";
import * as QueryUtil from "./util";
import {ColumnIdentifier} from "../column-identifier";
import {Order} from "../order";
import {MapDelegate} from "../map-delegate";
import {IAliasedTable} from "../aliased-table";

export function from<AliasedTableT extends IAliasedTable> (
    aliasedTable : QueryUtil.AssertValidJoinTarget<
        QueryUtil.NewInstance,
        AliasedTableT
    >
) : (
    QueryUtil.From<QueryUtil.NewInstance, AliasedTableT>
) {
    return QueryUtil.newInstance()
        .from<AliasedTableT>(aliasedTable);
}
export function select<
    SelectDelegateT extends QueryUtil.SelectDelegate<
        QueryUtil.NewInstance
    >
> (
    delegate : QueryUtil.AssertValidSelectDelegate<
        QueryUtil.NewInstance,
        SelectDelegateT
    >
) : (
    QueryUtil.Select<
        QueryUtil.NewInstance,
        SelectDelegateT
    >
) {
    return QueryUtil.newInstance()
        .select(delegate as any) as any;
}
export function selectExpr<
    SelectDelegateT extends QueryUtil.SelectExprDelegate<
        QueryUtil.NewInstance
    >
> (
    delegate : QueryUtil.AssertValidSelectExprDelegate<
        QueryUtil.NewInstance,
        SelectDelegateT
    >
) : (
    QueryUtil.SelectExpr<
        QueryUtil.NewInstance,
        SelectDelegateT
    >
) {
    return QueryUtil.newInstance()
        .selectExpr<SelectDelegateT>(delegate);
}
export function requireParentJoins<
    ArrT extends NonEmptyTuple<IAliasedTable>
> (
    ...arr : QueryUtil.AssertValidParentJoins<QueryUtil.NewInstance, ArrT>
) : (
    QueryUtil.RequireParentJoins<
        QueryUtil.NewInstance,
        false,
        ArrT
    >
) {
    return QueryUtil.newInstance()
        .requireParentJoins<ArrT>(...(arr as any));
}
export function requireNullableParentJoins<
    ArrT extends NonEmptyTuple<IAliasedTable>
> (
    ...arr : QueryUtil.AssertValidParentJoins<QueryUtil.NewInstance, ArrT>
) : (
    QueryUtil.RequireParentJoins<
        QueryUtil.NewInstance,
        true,
        ArrT
    >
) {
    return QueryUtil.newInstance()
        .requireNullableParentJoins<ArrT>(...(arr as any));
}

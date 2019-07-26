import {Query} from "../../query-impl";

export type NewInstance = Query<{
    _distinct : false;
    _sqlCalcFoundRows : false;

    _joins : undefined;
    _parentJoins : undefined;
    _selects : undefined;
    _where : undefined;

    _grouped : undefined;
    _having : undefined;

    _orders : undefined;
    _limit : undefined;

    _unions : undefined;
    _unionOrders : undefined;
    _unionLimit : undefined;

    _mapDelegate : undefined;
}>;
export function newInstance () : NewInstance {
    return new Query({
        _distinct : false,
        _sqlCalcFoundRows : false,

        _joins : undefined,
        _parentJoins : undefined,
        _selects : undefined,
        _where : undefined,

        _grouped : undefined,
        _having : undefined,

        _orders : undefined,
        _limit : undefined,

        _unions : undefined,
        _unionOrders : undefined,
        _unionLimit : undefined,

        _mapDelegate : undefined,
    });
}
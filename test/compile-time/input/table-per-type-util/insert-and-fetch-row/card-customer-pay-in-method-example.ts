import * as tsql from "../../../../../dist";
import {cardCustomerPayInMethodTpt} from "../card-customer-pay-in-method-example";

declare function insertAndFetchRow<T extends tsql.InsertableTablePerType> (t : T) : tsql.TablePerTypeUtil.InsertAndFetchRow<T>;

export const cardCustomerPayInMethod = insertAndFetchRow(
    cardCustomerPayInMethodTpt
);

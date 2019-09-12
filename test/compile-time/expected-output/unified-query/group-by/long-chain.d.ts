import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../dist";
export declare const query: tsql.Query<{
    fromClause: tsql.IFromClause<{
        outerQueryJoins: undefined;
        currentJoins: readonly tsql.Join<{
            tableAlias: "myTable";
            nullable: false;
            columns: {
                readonly myTableId: tsql.Column<{
                    tableAlias: "myTable";
                    columnAlias: "myTableId";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
            };
            originalColumns: {
                readonly myTableId: tsql.Column<{
                    tableAlias: "myTable";
                    columnAlias: "myTableId";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
            };
            primaryKey: undefined;
            candidateKeys: readonly [];
            deleteEnabled: true;
            mutableColumns: readonly [];
        }>[];
    }>;
    selectClause: [tsql.IExprSelectItem<{
        mapper: tm.Mapper<unknown, boolean>;
        tableAlias: "__aliased";
        alias: "eq1";
        usedRef: tsql.IUsedRef<never>;
    }>, tsql.IExprSelectItem<{
        mapper: tm.Mapper<unknown, boolean>;
        tableAlias: "__aliased";
        alias: "eq2";
        usedRef: tsql.IUsedRef<never>;
    }>, tsql.IExprSelectItem<{
        mapper: tm.Mapper<unknown, boolean>;
        tableAlias: "__aliased";
        alias: "eq3";
        usedRef: tsql.IUsedRef<never>;
    }>, tsql.IExprSelectItem<{
        mapper: tm.Mapper<unknown, boolean>;
        tableAlias: "__aliased";
        alias: "eq4";
        usedRef: tsql.IUsedRef<never>;
    }>, tsql.IExprSelectItem<{
        mapper: tm.Mapper<unknown, boolean>;
        tableAlias: "__aliased";
        alias: "eq5";
        usedRef: tsql.IUsedRef<never>;
    }>, tsql.IExprSelectItem<{
        mapper: tm.Mapper<unknown, boolean>;
        tableAlias: "__aliased";
        alias: "eq6";
        usedRef: tsql.IUsedRef<never>;
    }>, tsql.IExprSelectItem<{
        mapper: tm.Mapper<unknown, boolean>;
        tableAlias: "__aliased";
        alias: "eq7";
        usedRef: tsql.IUsedRef<never>;
    }>, tsql.IExprSelectItem<{
        mapper: tm.Mapper<unknown, boolean>;
        tableAlias: "__aliased";
        alias: "eq8";
        usedRef: tsql.IUsedRef<never>;
    }>, tsql.IExprSelectItem<{
        mapper: tm.Mapper<unknown, boolean>;
        tableAlias: "__aliased";
        alias: "eq9";
        usedRef: tsql.IUsedRef<never>;
    }>, tsql.IExprSelectItem<{
        mapper: tm.Mapper<unknown, boolean>;
        tableAlias: "__aliased";
        alias: "eq10";
        usedRef: tsql.IUsedRef<never>;
    }>, tsql.IExprSelectItem<{
        mapper: tm.Mapper<unknown, boolean>;
        tableAlias: "__aliased";
        alias: "eq11";
        usedRef: tsql.IUsedRef<never>;
    }>, tsql.IExprSelectItem<{
        mapper: tm.Mapper<unknown, boolean>;
        tableAlias: "__aliased";
        alias: "eq12";
        usedRef: tsql.IUsedRef<never>;
    }>, tsql.IExprSelectItem<{
        mapper: tm.Mapper<unknown, boolean>;
        tableAlias: "__aliased";
        alias: "eq13";
        usedRef: tsql.IUsedRef<never>;
    }>, tsql.IExprSelectItem<{
        mapper: tm.Mapper<unknown, boolean>;
        tableAlias: "__aliased";
        alias: "eq14";
        usedRef: tsql.IUsedRef<never>;
    }>, tsql.IExprSelectItem<{
        mapper: tm.Mapper<unknown, boolean>;
        tableAlias: "__aliased";
        alias: "eq15";
        usedRef: tsql.IUsedRef<never>;
    }>, tsql.IExprSelectItem<{
        mapper: tm.Mapper<unknown, boolean>;
        tableAlias: "__aliased";
        alias: "eq16";
        usedRef: tsql.IUsedRef<never>;
    }>, tsql.IExprSelectItem<{
        mapper: tm.Mapper<unknown, boolean>;
        tableAlias: "__aliased";
        alias: "eq17";
        usedRef: tsql.IUsedRef<never>;
    }>, tsql.IExprSelectItem<{
        mapper: tm.Mapper<unknown, boolean>;
        tableAlias: "__aliased";
        alias: "eq18";
        usedRef: tsql.IUsedRef<never>;
    }>, tsql.IExprSelectItem<{
        mapper: tm.Mapper<unknown, boolean>;
        tableAlias: "__aliased";
        alias: "eq19";
        usedRef: tsql.IUsedRef<never>;
    }>, tsql.IExprSelectItem<{
        mapper: tm.Mapper<unknown, boolean>;
        tableAlias: "__aliased";
        alias: "eq20";
        usedRef: tsql.IUsedRef<never>;
    }>, tsql.IExprSelectItem<{
        mapper: tm.Mapper<unknown, boolean>;
        tableAlias: "__aliased";
        alias: "eq21";
        usedRef: tsql.IUsedRef<never>;
    }>, tsql.IExprSelectItem<{
        mapper: tm.Mapper<unknown, boolean>;
        tableAlias: "__aliased";
        alias: "eq22";
        usedRef: tsql.IUsedRef<never>;
    }>, tsql.IExprSelectItem<{
        mapper: tm.Mapper<unknown, boolean>;
        tableAlias: "__aliased";
        alias: "eq23";
        usedRef: tsql.IUsedRef<never>;
    }>, tsql.IExprSelectItem<{
        mapper: tm.Mapper<unknown, boolean>;
        tableAlias: "__aliased";
        alias: "eq24";
        usedRef: tsql.IUsedRef<never>;
    }>, tsql.IExprSelectItem<{
        mapper: tm.Mapper<unknown, boolean>;
        tableAlias: "__aliased";
        alias: "eq25";
        usedRef: tsql.IUsedRef<never>;
    }>, tsql.IExprSelectItem<{
        mapper: tm.Mapper<unknown, boolean>;
        tableAlias: "__aliased";
        alias: "eq26";
        usedRef: tsql.IUsedRef<never>;
    }>, tsql.IExprSelectItem<{
        mapper: tm.Mapper<unknown, boolean>;
        tableAlias: "__aliased";
        alias: "eq27";
        usedRef: tsql.IUsedRef<never>;
    }>, tsql.IExprSelectItem<{
        mapper: tm.Mapper<unknown, boolean>;
        tableAlias: "__aliased";
        alias: "eq28";
        usedRef: tsql.IUsedRef<never>;
    }>, tsql.IExprSelectItem<{
        mapper: tm.Mapper<unknown, boolean>;
        tableAlias: "__aliased";
        alias: "eq29";
        usedRef: tsql.IUsedRef<never>;
    }>, tsql.IExprSelectItem<{
        mapper: tm.Mapper<unknown, boolean>;
        tableAlias: "__aliased";
        alias: "eq30";
        usedRef: tsql.IUsedRef<never>;
    }>, tsql.IExprSelectItem<{
        mapper: tm.Mapper<unknown, boolean>;
        tableAlias: "__aliased";
        alias: "eq31";
        usedRef: tsql.IUsedRef<never>;
    }>, tsql.IExprSelectItem<{
        mapper: tm.Mapper<unknown, boolean>;
        tableAlias: "__aliased";
        alias: "eq32";
        usedRef: tsql.IUsedRef<never>;
    }>, tsql.IExprSelectItem<{
        mapper: tm.Mapper<unknown, boolean>;
        tableAlias: "__aliased";
        alias: "eq33";
        usedRef: tsql.IUsedRef<never>;
    }>, tsql.IExprSelectItem<{
        mapper: tm.Mapper<unknown, boolean>;
        tableAlias: "__aliased";
        alias: "eq34";
        usedRef: tsql.IUsedRef<never>;
    }>, tsql.IExprSelectItem<{
        mapper: tm.Mapper<unknown, boolean>;
        tableAlias: "__aliased";
        alias: "eq35";
        usedRef: tsql.IUsedRef<never>;
    }>, tsql.IExprSelectItem<{
        mapper: tm.Mapper<unknown, boolean>;
        tableAlias: "__aliased";
        alias: "eq36";
        usedRef: tsql.IUsedRef<never>;
    }>, tsql.IExprSelectItem<{
        mapper: tm.Mapper<unknown, boolean>;
        tableAlias: "__aliased";
        alias: "eq37";
        usedRef: tsql.IUsedRef<never>;
    }>, tsql.IExprSelectItem<{
        mapper: tm.Mapper<unknown, boolean>;
        tableAlias: "__aliased";
        alias: "eq38";
        usedRef: tsql.IUsedRef<never>;
    }>, tsql.IExprSelectItem<{
        mapper: tm.Mapper<unknown, boolean>;
        tableAlias: "__aliased";
        alias: "eq39";
        usedRef: tsql.IUsedRef<never>;
    }>, tsql.IExprSelectItem<{
        mapper: tm.Mapper<unknown, boolean>;
        tableAlias: "__aliased";
        alias: "eq40";
        usedRef: tsql.IUsedRef<never>;
    }>, tsql.IExprSelectItem<{
        mapper: tm.Mapper<unknown, boolean>;
        tableAlias: "__aliased";
        alias: "eq41";
        usedRef: tsql.IUsedRef<never>;
    }>, tsql.IExprSelectItem<{
        mapper: tm.Mapper<unknown, boolean>;
        tableAlias: "__aliased";
        alias: "eq42";
        usedRef: tsql.IUsedRef<never>;
    }>, tsql.IExprSelectItem<{
        mapper: tm.Mapper<unknown, boolean>;
        tableAlias: "__aliased";
        alias: "eq43";
        usedRef: tsql.IUsedRef<never>;
    }>, tsql.IExprSelectItem<{
        mapper: tm.Mapper<unknown, boolean>;
        tableAlias: "__aliased";
        alias: "eq44";
        usedRef: tsql.IUsedRef<never>;
    }>, tsql.IExprSelectItem<{
        mapper: tm.Mapper<unknown, boolean>;
        tableAlias: "__aliased";
        alias: "eq45";
        usedRef: tsql.IUsedRef<never>;
    }>, tsql.IExprSelectItem<{
        mapper: tm.Mapper<unknown, boolean>;
        tableAlias: "__aliased";
        alias: "eq46";
        usedRef: tsql.IUsedRef<never>;
    }>, tsql.IExprSelectItem<{
        mapper: tm.Mapper<unknown, boolean>;
        tableAlias: "__aliased";
        alias: "eq47";
        usedRef: tsql.IUsedRef<never>;
    }>, tsql.IExprSelectItem<{
        mapper: tm.Mapper<unknown, boolean>;
        tableAlias: "__aliased";
        alias: "eq48";
        usedRef: tsql.IUsedRef<never>;
    }>, tsql.IExprSelectItem<{
        mapper: tm.Mapper<unknown, boolean>;
        tableAlias: "__aliased";
        alias: "eq49";
        usedRef: tsql.IUsedRef<never>;
    }>, tsql.IExprSelectItem<{
        mapper: tm.Mapper<unknown, boolean>;
        tableAlias: "__aliased";
        alias: "eq50";
        usedRef: tsql.IUsedRef<never>;
    }>, tsql.IExprSelectItem<{
        mapper: tm.Mapper<unknown, boolean>;
        tableAlias: "__aliased";
        alias: "eq51";
        usedRef: tsql.IUsedRef<never>;
    }>, tsql.IExprSelectItem<{
        mapper: tm.Mapper<unknown, boolean>;
        tableAlias: "__aliased";
        alias: "eq52";
        usedRef: tsql.IUsedRef<never>;
    }>, tsql.IExprSelectItem<{
        mapper: tm.Mapper<unknown, boolean>;
        tableAlias: "__aliased";
        alias: "eq53";
        usedRef: tsql.IUsedRef<never>;
    }>, tsql.IExprSelectItem<{
        mapper: tm.Mapper<unknown, boolean>;
        tableAlias: "__aliased";
        alias: "eq54";
        usedRef: tsql.IUsedRef<never>;
    }>, tsql.IExprSelectItem<{
        mapper: tm.Mapper<unknown, boolean>;
        tableAlias: "__aliased";
        alias: "eq55";
        usedRef: tsql.IUsedRef<never>;
    }>, tsql.IExprSelectItem<{
        mapper: tm.Mapper<unknown, boolean>;
        tableAlias: "__aliased";
        alias: "eq56";
        usedRef: tsql.IUsedRef<never>;
    }>, tsql.IExprSelectItem<{
        mapper: tm.Mapper<unknown, boolean>;
        tableAlias: "__aliased";
        alias: "eq57";
        usedRef: tsql.IUsedRef<never>;
    }>, tsql.IExprSelectItem<{
        mapper: tm.Mapper<unknown, boolean>;
        tableAlias: "__aliased";
        alias: "eq58";
        usedRef: tsql.IUsedRef<never>;
    }>, tsql.IExprSelectItem<{
        mapper: tm.Mapper<unknown, boolean>;
        tableAlias: "__aliased";
        alias: "eq59";
        usedRef: tsql.IUsedRef<never>;
    }>, tsql.IExprSelectItem<{
        mapper: tm.Mapper<unknown, boolean>;
        tableAlias: "__aliased";
        alias: "eq60";
        usedRef: tsql.IUsedRef<never>;
    }>];
    limitClause: undefined;
    compoundQueryClause: undefined;
    compoundQueryLimitClause: undefined;
}>;

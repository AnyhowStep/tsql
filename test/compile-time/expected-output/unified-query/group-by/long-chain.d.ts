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
        tableAlias: "$aliased";
        alias: "eq1";
        usedRef: tsql.IUsedRef<never>;
    }>, tsql.IExprSelectItem<{
        mapper: tm.Mapper<unknown, boolean>;
        tableAlias: "$aliased";
        alias: "eq2";
        usedRef: tsql.IUsedRef<never>;
    }>, tsql.IExprSelectItem<{
        mapper: tm.Mapper<unknown, boolean>;
        tableAlias: "$aliased";
        alias: "eq3";
        usedRef: tsql.IUsedRef<never>;
    }>, tsql.IExprSelectItem<{
        mapper: tm.Mapper<unknown, boolean>;
        tableAlias: "$aliased";
        alias: "eq4";
        usedRef: tsql.IUsedRef<never>;
    }>, tsql.IExprSelectItem<{
        mapper: tm.Mapper<unknown, boolean>;
        tableAlias: "$aliased";
        alias: "eq5";
        usedRef: tsql.IUsedRef<never>;
    }>, tsql.IExprSelectItem<{
        mapper: tm.Mapper<unknown, boolean>;
        tableAlias: "$aliased";
        alias: "eq6";
        usedRef: tsql.IUsedRef<never>;
    }>, tsql.IExprSelectItem<{
        mapper: tm.Mapper<unknown, boolean>;
        tableAlias: "$aliased";
        alias: "eq7";
        usedRef: tsql.IUsedRef<never>;
    }>, tsql.IExprSelectItem<{
        mapper: tm.Mapper<unknown, boolean>;
        tableAlias: "$aliased";
        alias: "eq8";
        usedRef: tsql.IUsedRef<never>;
    }>, tsql.IExprSelectItem<{
        mapper: tm.Mapper<unknown, boolean>;
        tableAlias: "$aliased";
        alias: "eq9";
        usedRef: tsql.IUsedRef<never>;
    }>, tsql.IExprSelectItem<{
        mapper: tm.Mapper<unknown, boolean>;
        tableAlias: "$aliased";
        alias: "eq10";
        usedRef: tsql.IUsedRef<never>;
    }>, tsql.IExprSelectItem<{
        mapper: tm.Mapper<unknown, boolean>;
        tableAlias: "$aliased";
        alias: "eq11";
        usedRef: tsql.IUsedRef<never>;
    }>, tsql.IExprSelectItem<{
        mapper: tm.Mapper<unknown, boolean>;
        tableAlias: "$aliased";
        alias: "eq12";
        usedRef: tsql.IUsedRef<never>;
    }>, tsql.IExprSelectItem<{
        mapper: tm.Mapper<unknown, boolean>;
        tableAlias: "$aliased";
        alias: "eq13";
        usedRef: tsql.IUsedRef<never>;
    }>, tsql.IExprSelectItem<{
        mapper: tm.Mapper<unknown, boolean>;
        tableAlias: "$aliased";
        alias: "eq14";
        usedRef: tsql.IUsedRef<never>;
    }>, tsql.IExprSelectItem<{
        mapper: tm.Mapper<unknown, boolean>;
        tableAlias: "$aliased";
        alias: "eq15";
        usedRef: tsql.IUsedRef<never>;
    }>, tsql.IExprSelectItem<{
        mapper: tm.Mapper<unknown, boolean>;
        tableAlias: "$aliased";
        alias: "eq16";
        usedRef: tsql.IUsedRef<never>;
    }>, tsql.IExprSelectItem<{
        mapper: tm.Mapper<unknown, boolean>;
        tableAlias: "$aliased";
        alias: "eq17";
        usedRef: tsql.IUsedRef<never>;
    }>, tsql.IExprSelectItem<{
        mapper: tm.Mapper<unknown, boolean>;
        tableAlias: "$aliased";
        alias: "eq18";
        usedRef: tsql.IUsedRef<never>;
    }>, tsql.IExprSelectItem<{
        mapper: tm.Mapper<unknown, boolean>;
        tableAlias: "$aliased";
        alias: "eq19";
        usedRef: tsql.IUsedRef<never>;
    }>, tsql.IExprSelectItem<{
        mapper: tm.Mapper<unknown, boolean>;
        tableAlias: "$aliased";
        alias: "eq20";
        usedRef: tsql.IUsedRef<never>;
    }>, tsql.IExprSelectItem<{
        mapper: tm.Mapper<unknown, boolean>;
        tableAlias: "$aliased";
        alias: "eq21";
        usedRef: tsql.IUsedRef<never>;
    }>, tsql.IExprSelectItem<{
        mapper: tm.Mapper<unknown, boolean>;
        tableAlias: "$aliased";
        alias: "eq22";
        usedRef: tsql.IUsedRef<never>;
    }>, tsql.IExprSelectItem<{
        mapper: tm.Mapper<unknown, boolean>;
        tableAlias: "$aliased";
        alias: "eq23";
        usedRef: tsql.IUsedRef<never>;
    }>, tsql.IExprSelectItem<{
        mapper: tm.Mapper<unknown, boolean>;
        tableAlias: "$aliased";
        alias: "eq24";
        usedRef: tsql.IUsedRef<never>;
    }>, tsql.IExprSelectItem<{
        mapper: tm.Mapper<unknown, boolean>;
        tableAlias: "$aliased";
        alias: "eq25";
        usedRef: tsql.IUsedRef<never>;
    }>, tsql.IExprSelectItem<{
        mapper: tm.Mapper<unknown, boolean>;
        tableAlias: "$aliased";
        alias: "eq26";
        usedRef: tsql.IUsedRef<never>;
    }>, tsql.IExprSelectItem<{
        mapper: tm.Mapper<unknown, boolean>;
        tableAlias: "$aliased";
        alias: "eq27";
        usedRef: tsql.IUsedRef<never>;
    }>, tsql.IExprSelectItem<{
        mapper: tm.Mapper<unknown, boolean>;
        tableAlias: "$aliased";
        alias: "eq28";
        usedRef: tsql.IUsedRef<never>;
    }>, tsql.IExprSelectItem<{
        mapper: tm.Mapper<unknown, boolean>;
        tableAlias: "$aliased";
        alias: "eq29";
        usedRef: tsql.IUsedRef<never>;
    }>, tsql.IExprSelectItem<{
        mapper: tm.Mapper<unknown, boolean>;
        tableAlias: "$aliased";
        alias: "eq30";
        usedRef: tsql.IUsedRef<never>;
    }>, tsql.IExprSelectItem<{
        mapper: tm.Mapper<unknown, boolean>;
        tableAlias: "$aliased";
        alias: "eq31";
        usedRef: tsql.IUsedRef<never>;
    }>, tsql.IExprSelectItem<{
        mapper: tm.Mapper<unknown, boolean>;
        tableAlias: "$aliased";
        alias: "eq32";
        usedRef: tsql.IUsedRef<never>;
    }>, tsql.IExprSelectItem<{
        mapper: tm.Mapper<unknown, boolean>;
        tableAlias: "$aliased";
        alias: "eq33";
        usedRef: tsql.IUsedRef<never>;
    }>, tsql.IExprSelectItem<{
        mapper: tm.Mapper<unknown, boolean>;
        tableAlias: "$aliased";
        alias: "eq34";
        usedRef: tsql.IUsedRef<never>;
    }>, tsql.IExprSelectItem<{
        mapper: tm.Mapper<unknown, boolean>;
        tableAlias: "$aliased";
        alias: "eq35";
        usedRef: tsql.IUsedRef<never>;
    }>, tsql.IExprSelectItem<{
        mapper: tm.Mapper<unknown, boolean>;
        tableAlias: "$aliased";
        alias: "eq36";
        usedRef: tsql.IUsedRef<never>;
    }>, tsql.IExprSelectItem<{
        mapper: tm.Mapper<unknown, boolean>;
        tableAlias: "$aliased";
        alias: "eq37";
        usedRef: tsql.IUsedRef<never>;
    }>, tsql.IExprSelectItem<{
        mapper: tm.Mapper<unknown, boolean>;
        tableAlias: "$aliased";
        alias: "eq38";
        usedRef: tsql.IUsedRef<never>;
    }>, tsql.IExprSelectItem<{
        mapper: tm.Mapper<unknown, boolean>;
        tableAlias: "$aliased";
        alias: "eq39";
        usedRef: tsql.IUsedRef<never>;
    }>, tsql.IExprSelectItem<{
        mapper: tm.Mapper<unknown, boolean>;
        tableAlias: "$aliased";
        alias: "eq40";
        usedRef: tsql.IUsedRef<never>;
    }>, tsql.IExprSelectItem<{
        mapper: tm.Mapper<unknown, boolean>;
        tableAlias: "$aliased";
        alias: "eq41";
        usedRef: tsql.IUsedRef<never>;
    }>, tsql.IExprSelectItem<{
        mapper: tm.Mapper<unknown, boolean>;
        tableAlias: "$aliased";
        alias: "eq42";
        usedRef: tsql.IUsedRef<never>;
    }>, tsql.IExprSelectItem<{
        mapper: tm.Mapper<unknown, boolean>;
        tableAlias: "$aliased";
        alias: "eq43";
        usedRef: tsql.IUsedRef<never>;
    }>, tsql.IExprSelectItem<{
        mapper: tm.Mapper<unknown, boolean>;
        tableAlias: "$aliased";
        alias: "eq44";
        usedRef: tsql.IUsedRef<never>;
    }>, tsql.IExprSelectItem<{
        mapper: tm.Mapper<unknown, boolean>;
        tableAlias: "$aliased";
        alias: "eq45";
        usedRef: tsql.IUsedRef<never>;
    }>, tsql.IExprSelectItem<{
        mapper: tm.Mapper<unknown, boolean>;
        tableAlias: "$aliased";
        alias: "eq46";
        usedRef: tsql.IUsedRef<never>;
    }>, tsql.IExprSelectItem<{
        mapper: tm.Mapper<unknown, boolean>;
        tableAlias: "$aliased";
        alias: "eq47";
        usedRef: tsql.IUsedRef<never>;
    }>, tsql.IExprSelectItem<{
        mapper: tm.Mapper<unknown, boolean>;
        tableAlias: "$aliased";
        alias: "eq48";
        usedRef: tsql.IUsedRef<never>;
    }>, tsql.IExprSelectItem<{
        mapper: tm.Mapper<unknown, boolean>;
        tableAlias: "$aliased";
        alias: "eq49";
        usedRef: tsql.IUsedRef<never>;
    }>, tsql.IExprSelectItem<{
        mapper: tm.Mapper<unknown, boolean>;
        tableAlias: "$aliased";
        alias: "eq50";
        usedRef: tsql.IUsedRef<never>;
    }>, tsql.IExprSelectItem<{
        mapper: tm.Mapper<unknown, boolean>;
        tableAlias: "$aliased";
        alias: "eq51";
        usedRef: tsql.IUsedRef<never>;
    }>, tsql.IExprSelectItem<{
        mapper: tm.Mapper<unknown, boolean>;
        tableAlias: "$aliased";
        alias: "eq52";
        usedRef: tsql.IUsedRef<never>;
    }>, tsql.IExprSelectItem<{
        mapper: tm.Mapper<unknown, boolean>;
        tableAlias: "$aliased";
        alias: "eq53";
        usedRef: tsql.IUsedRef<never>;
    }>, tsql.IExprSelectItem<{
        mapper: tm.Mapper<unknown, boolean>;
        tableAlias: "$aliased";
        alias: "eq54";
        usedRef: tsql.IUsedRef<never>;
    }>, tsql.IExprSelectItem<{
        mapper: tm.Mapper<unknown, boolean>;
        tableAlias: "$aliased";
        alias: "eq55";
        usedRef: tsql.IUsedRef<never>;
    }>, tsql.IExprSelectItem<{
        mapper: tm.Mapper<unknown, boolean>;
        tableAlias: "$aliased";
        alias: "eq56";
        usedRef: tsql.IUsedRef<never>;
    }>, tsql.IExprSelectItem<{
        mapper: tm.Mapper<unknown, boolean>;
        tableAlias: "$aliased";
        alias: "eq57";
        usedRef: tsql.IUsedRef<never>;
    }>, tsql.IExprSelectItem<{
        mapper: tm.Mapper<unknown, boolean>;
        tableAlias: "$aliased";
        alias: "eq58";
        usedRef: tsql.IUsedRef<never>;
    }>, tsql.IExprSelectItem<{
        mapper: tm.Mapper<unknown, boolean>;
        tableAlias: "$aliased";
        alias: "eq59";
        usedRef: tsql.IUsedRef<never>;
    }>, tsql.IExprSelectItem<{
        mapper: tm.Mapper<unknown, boolean>;
        tableAlias: "$aliased";
        alias: "eq60";
        usedRef: tsql.IUsedRef<never>;
    }>];
    limitClause: undefined;
    compoundQueryClause: undefined;
    compoundQueryLimitClause: undefined;
    mapDelegate: undefined;
}>;

import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../dist";

const myTable = tsql.table("myTable")
    .addColumns({
        myTableId : tm.mysql.bigIntUnsigned(),
    });

export const query = tsql.QueryUtil.newInstance()
    .from(myTable)
    .select(columns => [
        tsql.eq(columns.myTableId, 1n).as("eq1"),
    ])
    .groupBy(columns => [
        columns.__aliased.eq1,
    ])
    .select(columns => [
        tsql.eq(columns.myTableId, 2n).as("eq2"),
    ])
    .groupBy(columns => [
        columns.__aliased.eq2,
    ])
    .select(columns => [
        tsql.eq(columns.myTableId, 3n).as("eq3"),
    ])
    .groupBy(columns => [
        columns.__aliased.eq3,
    ])
    .select(columns => [
        tsql.eq(columns.myTableId, 4n).as("eq4"),
    ])
    .groupBy(columns => [
        columns.__aliased.eq4,
    ])
    .select(columns => [
        tsql.eq(columns.myTableId, 5n).as("eq5"),
    ])
    .groupBy(columns => [
        columns.__aliased.eq5,
    ])
    .select(columns => [
        tsql.eq(columns.myTableId, 6n).as("eq6"),
    ])
    .groupBy(columns => [
        columns.__aliased.eq6,
    ])
    .select(columns => [
        tsql.eq(columns.myTableId, 7n).as("eq7"),
    ])
    .groupBy(columns => [
        columns.__aliased.eq7,
    ])
    .select(columns => [
        tsql.eq(columns.myTableId, 8n).as("eq8"),
    ])
    .groupBy(columns => [
        columns.__aliased.eq8,
    ])
    .select(columns => [
        tsql.eq(columns.myTableId, 9n).as("eq9"),
    ])
    .groupBy(columns => [
        columns.__aliased.eq9,
    ])
    .select(columns => [
        tsql.eq(columns.myTableId, 10n).as("eq10"),
    ])
    .groupBy(columns => [
        columns.__aliased.eq10,
    ])
    .select(columns => [
        tsql.eq(columns.myTableId, 11n).as("eq11"),
    ])
    .groupBy(columns => [
        columns.__aliased.eq11,
    ])
    .select(columns => [
        tsql.eq(columns.myTableId, 12n).as("eq12"),
    ])
    .groupBy(columns => [
        columns.__aliased.eq12,
    ])
    .select(columns => [
        tsql.eq(columns.myTableId, 13n).as("eq13"),
    ])
    .groupBy(columns => [
        columns.__aliased.eq13,
    ])
    .select(columns => [
        tsql.eq(columns.myTableId, 14n).as("eq14"),
    ])
    .groupBy(columns => [
        columns.__aliased.eq14,
    ])
    .select(columns => [
        tsql.eq(columns.myTableId, 15n).as("eq15"),
    ])
    .groupBy(columns => [
        columns.__aliased.eq15,
    ])
    .select(columns => [
        tsql.eq(columns.myTableId, 16n).as("eq16"),
    ])
    .groupBy(columns => [
        columns.__aliased.eq16,
    ])
    .select(columns => [
        tsql.eq(columns.myTableId, 17n).as("eq17"),
    ])
    .groupBy(columns => [
        columns.__aliased.eq17,
    ])
    .select(columns => [
        tsql.eq(columns.myTableId, 18n).as("eq18"),
    ])
    .groupBy(columns => [
        columns.__aliased.eq18,
    ])
    .select(columns => [
        tsql.eq(columns.myTableId, 19n).as("eq19"),
    ])
    .groupBy(columns => [
        columns.__aliased.eq19,
    ])
    .select(columns => [
        tsql.eq(columns.myTableId, 20n).as("eq20"),
    ])
    .groupBy(columns => [
        columns.__aliased.eq20,
    ])
    .select(columns => [
        tsql.eq(columns.myTableId, 21n).as("eq21"),
    ])
    .groupBy(columns => [
        columns.__aliased.eq21,
    ])
    .select(columns => [
        tsql.eq(columns.myTableId, 22n).as("eq22"),
    ])
    .groupBy(columns => [
        columns.__aliased.eq22,
    ])
    .select(columns => [
        tsql.eq(columns.myTableId, 23n).as("eq23"),
    ])
    .groupBy(columns => [
        columns.__aliased.eq23,
    ])
    .select(columns => [
        tsql.eq(columns.myTableId, 24n).as("eq24"),
    ])
    .groupBy(columns => [
        columns.__aliased.eq24,
    ])
    .select(columns => [
        tsql.eq(columns.myTableId, 25n).as("eq25"),
    ])
    .groupBy(columns => [
        columns.__aliased.eq25,
    ])
    .select(columns => [
        tsql.eq(columns.myTableId, 26n).as("eq26"),
    ])
    .groupBy(columns => [
        columns.__aliased.eq26,
    ])
    .select(columns => [
        tsql.eq(columns.myTableId, 27n).as("eq27"),
    ])
    .groupBy(columns => [
        columns.__aliased.eq27,
    ])
    .select(columns => [
        tsql.eq(columns.myTableId, 28n).as("eq28"),
    ])
    .groupBy(columns => [
        columns.__aliased.eq28,
    ])
    .select(columns => [
        tsql.eq(columns.myTableId, 29n).as("eq29"),
    ])
    .groupBy(columns => [
        columns.__aliased.eq29,
    ])
    .select(columns => [
        tsql.eq(columns.myTableId, 30n).as("eq30"),
    ])
    .groupBy(columns => [
        columns.__aliased.eq30,
    ])
    .select(columns => [
        tsql.eq(columns.myTableId, 31n).as("eq31"),
    ])
    .groupBy(columns => [
        columns.__aliased.eq31,
    ])
    .select(columns => [
        tsql.eq(columns.myTableId, 32n).as("eq32"),
    ])
    .groupBy(columns => [
        columns.__aliased.eq32,
    ])
    .select(columns => [
        tsql.eq(columns.myTableId, 33n).as("eq33"),
    ])
    .groupBy(columns => [
        columns.__aliased.eq33,
    ])
    .select(columns => [
        tsql.eq(columns.myTableId, 34n).as("eq34"),
    ])
    .groupBy(columns => [
        columns.__aliased.eq34,
    ])
    .select(columns => [
        tsql.eq(columns.myTableId, 35n).as("eq35"),
    ])
    .groupBy(columns => [
        columns.__aliased.eq35,
    ])
    .select(columns => [
        tsql.eq(columns.myTableId, 36n).as("eq36"),
    ])
    .groupBy(columns => [
        columns.__aliased.eq36,
    ])
    .select(columns => [
        tsql.eq(columns.myTableId, 37n).as("eq37"),
    ])
    .groupBy(columns => [
        columns.__aliased.eq37,
    ])
    .select(columns => [
        tsql.eq(columns.myTableId, 38n).as("eq38"),
    ])
    .groupBy(columns => [
        columns.__aliased.eq38,
    ])
    .select(columns => [
        tsql.eq(columns.myTableId, 39n).as("eq39"),
    ])
    .groupBy(columns => [
        columns.__aliased.eq39,
    ])
    .select(columns => [
        tsql.eq(columns.myTableId, 40n).as("eq40"),
    ])
    .groupBy(columns => [
        columns.__aliased.eq40,
    ])
    .select(columns => [
        tsql.eq(columns.myTableId, 41n).as("eq41"),
    ])
    .groupBy(columns => [
        columns.__aliased.eq41,
    ])
    .select(columns => [
        tsql.eq(columns.myTableId, 42n).as("eq42"),
    ])
    .groupBy(columns => [
        columns.__aliased.eq42,
    ])
    .select(columns => [
        tsql.eq(columns.myTableId, 43n).as("eq43"),
    ])
    .groupBy(columns => [
        columns.__aliased.eq43,
    ])
    .select(columns => [
        tsql.eq(columns.myTableId, 44n).as("eq44"),
    ])
    .groupBy(columns => [
        columns.__aliased.eq44,
    ])
    .select(columns => [
        tsql.eq(columns.myTableId, 45n).as("eq45"),
    ])
    .groupBy(columns => [
        columns.__aliased.eq45,
    ])
    .select(columns => [
        tsql.eq(columns.myTableId, 46n).as("eq46"),
    ])
    .groupBy(columns => [
        columns.__aliased.eq46,
    ])
    .select(columns => [
        tsql.eq(columns.myTableId, 47n).as("eq47"),
    ])
    .groupBy(columns => [
        columns.__aliased.eq47,
    ])
    .select(columns => [
        tsql.eq(columns.myTableId, 48n).as("eq48"),
    ])
    .groupBy(columns => [
        columns.__aliased.eq48,
    ])
    .select(columns => [
        tsql.eq(columns.myTableId, 49n).as("eq49"),
    ])
    .groupBy(columns => [
        columns.__aliased.eq49,
    ])
    .select(columns => [
        tsql.eq(columns.myTableId, 50n).as("eq50"),
    ])
    .groupBy(columns => [
        columns.__aliased.eq50,
    ])
    .select(columns => [
        tsql.eq(columns.myTableId, 51n).as("eq51"),
    ])
    .groupBy(columns => [
        columns.__aliased.eq51,
    ])
    .select(columns => [
        tsql.eq(columns.myTableId, 52n).as("eq52"),
    ])
    .groupBy(columns => [
        columns.__aliased.eq52,
    ])
    .select(columns => [
        tsql.eq(columns.myTableId, 53n).as("eq53"),
    ])
    .groupBy(columns => [
        columns.__aliased.eq53,
    ])
    .select(columns => [
        tsql.eq(columns.myTableId, 54n).as("eq54"),
    ])
    .groupBy(columns => [
        columns.__aliased.eq54,
    ])
    .select(columns => [
        tsql.eq(columns.myTableId, 55n).as("eq55"),
    ])
    .groupBy(columns => [
        columns.__aliased.eq55,
    ])
    .select(columns => [
        tsql.eq(columns.myTableId, 56n).as("eq56"),
    ])
    .groupBy(columns => [
        columns.__aliased.eq56,
    ])
    .select(columns => [
        tsql.eq(columns.myTableId, 57n).as("eq57"),
    ])
    .groupBy(columns => [
        columns.__aliased.eq57,
    ])
    .select(columns => [
        tsql.eq(columns.myTableId, 58n).as("eq58"),
    ])
    .groupBy(columns => [
        columns.__aliased.eq58,
    ])
    .select(columns => [
        tsql.eq(columns.myTableId, 59n).as("eq59"),
    ])
    .groupBy(columns => [
        columns.__aliased.eq59,
    ])
    .select(columns => [
        tsql.eq(columns.myTableId, 60n).as("eq60"),
    ])
    .groupBy(columns => [
        columns.__aliased.eq60,
    ]);

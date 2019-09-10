import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../dist";

const myTable = tsql.table("myTable")
    .addColumns({
        x : tm.mysql.bigIntUnsigned(),
        myTableId : tm.mysql.bigIntUnsigned(),
    });

const myOtherTable1 = tsql.table("myOtherTable1").addColumns({ x : tm.mysql.bigIntUnsigned(), y : tm.mysql.varChar(255), z : tm.mysql.boolean() }).setPrimaryKey(columns => [columns.x]);
const myOtherTable2 = tsql.table("myOtherTable2").addColumns({ x : tm.mysql.bigIntUnsigned(), y : tm.mysql.varChar(255), z : tm.mysql.boolean() }).setPrimaryKey(columns => [columns.x]);
const myOtherTable3 = tsql.table("myOtherTable3").addColumns({ x : tm.mysql.bigIntUnsigned(), y : tm.mysql.varChar(255), z : tm.mysql.boolean() }).setPrimaryKey(columns => [columns.x]);
const myOtherTable4 = tsql.table("myOtherTable4").addColumns({ x : tm.mysql.bigIntUnsigned(), y : tm.mysql.varChar(255), z : tm.mysql.boolean() }).setPrimaryKey(columns => [columns.x]);
const myOtherTable5 = tsql.table("myOtherTable5").addColumns({ x : tm.mysql.bigIntUnsigned(), y : tm.mysql.varChar(255), z : tm.mysql.boolean() }).setPrimaryKey(columns => [columns.x]);
const myOtherTable6 = tsql.table("myOtherTable6").addColumns({ x : tm.mysql.bigIntUnsigned(), y : tm.mysql.varChar(255), z : tm.mysql.boolean() }).setPrimaryKey(columns => [columns.x]);
const myOtherTable7 = tsql.table("myOtherTable7").addColumns({ x : tm.mysql.bigIntUnsigned(), y : tm.mysql.varChar(255), z : tm.mysql.boolean() }).setPrimaryKey(columns => [columns.x]);
const myOtherTable8 = tsql.table("myOtherTable8").addColumns({ x : tm.mysql.bigIntUnsigned(), y : tm.mysql.varChar(255), z : tm.mysql.boolean() }).setPrimaryKey(columns => [columns.x]);
const myOtherTable9 = tsql.table("myOtherTable9").addColumns({ x : tm.mysql.bigIntUnsigned(), y : tm.mysql.varChar(255), z : tm.mysql.boolean() }).setPrimaryKey(columns => [columns.x]);
const myOtherTable10 = tsql.table("myOtherTable10").addColumns({ x : tm.mysql.bigIntUnsigned(), y : tm.mysql.varChar(255), z : tm.mysql.boolean() }).setPrimaryKey(columns => [columns.x]);

const myOtherTable11 = tsql.table("myOtherTable11").addColumns({ x : tm.mysql.bigIntUnsigned(), y : tm.mysql.varChar(255), z : tm.mysql.boolean() }).setPrimaryKey(columns => [columns.x]);
const myOtherTable12 = tsql.table("myOtherTable12").addColumns({ x : tm.mysql.bigIntUnsigned(), y : tm.mysql.varChar(255), z : tm.mysql.boolean() }).setPrimaryKey(columns => [columns.x]);
const myOtherTable13 = tsql.table("myOtherTable13").addColumns({ x : tm.mysql.bigIntUnsigned(), y : tm.mysql.varChar(255), z : tm.mysql.boolean() }).setPrimaryKey(columns => [columns.x]);
const myOtherTable14 = tsql.table("myOtherTable14").addColumns({ x : tm.mysql.bigIntUnsigned(), y : tm.mysql.varChar(255), z : tm.mysql.boolean() }).setPrimaryKey(columns => [columns.x]);
const myOtherTable15 = tsql.table("myOtherTable15").addColumns({ x : tm.mysql.bigIntUnsigned(), y : tm.mysql.varChar(255), z : tm.mysql.boolean() }).setPrimaryKey(columns => [columns.x]);
const myOtherTable16 = tsql.table("myOtherTable16").addColumns({ x : tm.mysql.bigIntUnsigned(), y : tm.mysql.varChar(255), z : tm.mysql.boolean() }).setPrimaryKey(columns => [columns.x]);
const myOtherTable17 = tsql.table("myOtherTable17").addColumns({ x : tm.mysql.bigIntUnsigned(), y : tm.mysql.varChar(255), z : tm.mysql.boolean() }).setPrimaryKey(columns => [columns.x]);
const myOtherTable18 = tsql.table("myOtherTable18").addColumns({ x : tm.mysql.bigIntUnsigned(), y : tm.mysql.varChar(255), z : tm.mysql.boolean() }).setPrimaryKey(columns => [columns.x]);
const myOtherTable19 = tsql.table("myOtherTable19").addColumns({ x : tm.mysql.bigIntUnsigned(), y : tm.mysql.varChar(255), z : tm.mysql.boolean() }).setPrimaryKey(columns => [columns.x]);
const myOtherTable20 = tsql.table("myOtherTable20").addColumns({ x : tm.mysql.bigIntUnsigned(), y : tm.mysql.varChar(255), z : tm.mysql.boolean() }).setPrimaryKey(columns => [columns.x]);

const myOtherTable21 = tsql.table("myOtherTable21").addColumns({ x : tm.mysql.bigIntUnsigned(), y : tm.mysql.varChar(255), z : tm.mysql.boolean() }).setPrimaryKey(columns => [columns.x])
const myOtherTable22 = tsql.table("myOtherTable22").addColumns({ x : tm.mysql.bigIntUnsigned(), y : tm.mysql.varChar(255), z : tm.mysql.boolean() }).setPrimaryKey(columns => [columns.x])
const myOtherTable23 = tsql.table("myOtherTable23").addColumns({ x : tm.mysql.bigIntUnsigned(), y : tm.mysql.varChar(255), z : tm.mysql.boolean() }).setPrimaryKey(columns => [columns.x])
const myOtherTable24 = tsql.table("myOtherTable24").addColumns({ x : tm.mysql.bigIntUnsigned(), y : tm.mysql.varChar(255), z : tm.mysql.boolean() }).setPrimaryKey(columns => [columns.x])
const myOtherTable25 = tsql.table("myOtherTable25").addColumns({ x : tm.mysql.bigIntUnsigned(), y : tm.mysql.varChar(255), z : tm.mysql.boolean() }).setPrimaryKey(columns => [columns.x])
const myOtherTable26 = tsql.table("myOtherTable26").addColumns({ x : tm.mysql.bigIntUnsigned(), y : tm.mysql.varChar(255), z : tm.mysql.boolean() }).setPrimaryKey(columns => [columns.x])
const myOtherTable27 = tsql.table("myOtherTable27").addColumns({ x : tm.mysql.bigIntUnsigned(), y : tm.mysql.varChar(255), z : tm.mysql.boolean() }).setPrimaryKey(columns => [columns.x])
const myOtherTable28 = tsql.table("myOtherTable28").addColumns({ x : tm.mysql.bigIntUnsigned(), y : tm.mysql.varChar(255), z : tm.mysql.boolean() }).setPrimaryKey(columns => [columns.x])
const myOtherTable29 = tsql.table("myOtherTable29").addColumns({ x : tm.mysql.bigIntUnsigned(), y : tm.mysql.varChar(255), z : tm.mysql.boolean() }).setPrimaryKey(columns => [columns.x])
const myOtherTable30 = tsql.table("myOtherTable30").addColumns({ x : tm.mysql.bigIntUnsigned(), y : tm.mysql.varChar(255), z : tm.mysql.boolean() }).setPrimaryKey(columns => [columns.x])

const myOtherTable31 = tsql.table("myOtherTable31").addColumns({ x : tm.mysql.bigIntUnsigned(), y : tm.mysql.varChar(255), z : tm.mysql.boolean() }).setPrimaryKey(columns => [columns.x])
const myOtherTable32 = tsql.table("myOtherTable32").addColumns({ x : tm.mysql.bigIntUnsigned(), y : tm.mysql.varChar(255), z : tm.mysql.boolean() }).setPrimaryKey(columns => [columns.x])
const myOtherTable33 = tsql.table("myOtherTable33").addColumns({ x : tm.mysql.bigIntUnsigned(), y : tm.mysql.varChar(255), z : tm.mysql.boolean() }).setPrimaryKey(columns => [columns.x])
const myOtherTable34 = tsql.table("myOtherTable34").addColumns({ x : tm.mysql.bigIntUnsigned(), y : tm.mysql.varChar(255), z : tm.mysql.boolean() }).setPrimaryKey(columns => [columns.x])
const myOtherTable35 = tsql.table("myOtherTable35").addColumns({ x : tm.mysql.bigIntUnsigned(), y : tm.mysql.varChar(255), z : tm.mysql.boolean() }).setPrimaryKey(columns => [columns.x])
const myOtherTable36 = tsql.table("myOtherTable36").addColumns({ x : tm.mysql.bigIntUnsigned(), y : tm.mysql.varChar(255), z : tm.mysql.boolean() }).setPrimaryKey(columns => [columns.x])
const myOtherTable37 = tsql.table("myOtherTable37").addColumns({ x : tm.mysql.bigIntUnsigned(), y : tm.mysql.varChar(255), z : tm.mysql.boolean() }).setPrimaryKey(columns => [columns.x])
const myOtherTable38 = tsql.table("myOtherTable38").addColumns({ x : tm.mysql.bigIntUnsigned(), y : tm.mysql.varChar(255), z : tm.mysql.boolean() }).setPrimaryKey(columns => [columns.x])
const myOtherTable39 = tsql.table("myOtherTable39").addColumns({ x : tm.mysql.bigIntUnsigned(), y : tm.mysql.varChar(255), z : tm.mysql.boolean() }).setPrimaryKey(columns => [columns.x])
const myOtherTable40 = tsql.table("myOtherTable40").addColumns({ x : tm.mysql.bigIntUnsigned(), y : tm.mysql.varChar(255), z : tm.mysql.boolean() }).setPrimaryKey(columns => [columns.x])

const myOtherTable41 = tsql.table("myOtherTable41").addColumns({ x : tm.mysql.bigIntUnsigned(), y : tm.mysql.varChar(255), z : tm.mysql.boolean() }).setPrimaryKey(columns => [columns.x])
const myOtherTable42 = tsql.table("myOtherTable42").addColumns({ x : tm.mysql.bigIntUnsigned(), y : tm.mysql.varChar(255), z : tm.mysql.boolean() }).setPrimaryKey(columns => [columns.x])
const myOtherTable43 = tsql.table("myOtherTable43").addColumns({ x : tm.mysql.bigIntUnsigned(), y : tm.mysql.varChar(255), z : tm.mysql.boolean() }).setPrimaryKey(columns => [columns.x])
const myOtherTable44 = tsql.table("myOtherTable44").addColumns({ x : tm.mysql.bigIntUnsigned(), y : tm.mysql.varChar(255), z : tm.mysql.boolean() }).setPrimaryKey(columns => [columns.x])
const myOtherTable45 = tsql.table("myOtherTable45").addColumns({ x : tm.mysql.bigIntUnsigned(), y : tm.mysql.varChar(255), z : tm.mysql.boolean() }).setPrimaryKey(columns => [columns.x])
const myOtherTable46 = tsql.table("myOtherTable46").addColumns({ x : tm.mysql.bigIntUnsigned(), y : tm.mysql.varChar(255), z : tm.mysql.boolean() }).setPrimaryKey(columns => [columns.x])
const myOtherTable47 = tsql.table("myOtherTable47").addColumns({ x : tm.mysql.bigIntUnsigned(), y : tm.mysql.varChar(255), z : tm.mysql.boolean() }).setPrimaryKey(columns => [columns.x])
const myOtherTable48 = tsql.table("myOtherTable48").addColumns({ x : tm.mysql.bigIntUnsigned(), y : tm.mysql.varChar(255), z : tm.mysql.boolean() }).setPrimaryKey(columns => [columns.x])
const myOtherTable49 = tsql.table("myOtherTable49").addColumns({ x : tm.mysql.bigIntUnsigned(), y : tm.mysql.varChar(255), z : tm.mysql.boolean() }).setPrimaryKey(columns => [columns.x])
const myOtherTable50 = tsql.table("myOtherTable50").addColumns({ x : tm.mysql.bigIntUnsigned(), y : tm.mysql.varChar(255), z : tm.mysql.boolean() }).setPrimaryKey(columns => [columns.x])

const myOtherTable51 = tsql.table("myOtherTable51").addColumns({ x : tm.mysql.bigIntUnsigned(), y : tm.mysql.varChar(255), z : tm.mysql.boolean() }).setPrimaryKey(columns => [columns.x])
const myOtherTable52 = tsql.table("myOtherTable52").addColumns({ x : tm.mysql.bigIntUnsigned(), y : tm.mysql.varChar(255), z : tm.mysql.boolean() }).setPrimaryKey(columns => [columns.x])
const myOtherTable53 = tsql.table("myOtherTable53").addColumns({ x : tm.mysql.bigIntUnsigned(), y : tm.mysql.varChar(255), z : tm.mysql.boolean() }).setPrimaryKey(columns => [columns.x])
const myOtherTable54 = tsql.table("myOtherTable54").addColumns({ x : tm.mysql.bigIntUnsigned(), y : tm.mysql.varChar(255), z : tm.mysql.boolean() }).setPrimaryKey(columns => [columns.x])
const myOtherTable55 = tsql.table("myOtherTable55").addColumns({ x : tm.mysql.bigIntUnsigned(), y : tm.mysql.varChar(255), z : tm.mysql.boolean() }).setPrimaryKey(columns => [columns.x])
const myOtherTable56 = tsql.table("myOtherTable56").addColumns({ x : tm.mysql.bigIntUnsigned(), y : tm.mysql.varChar(255), z : tm.mysql.boolean() }).setPrimaryKey(columns => [columns.x])
const myOtherTable57 = tsql.table("myOtherTable57").addColumns({ x : tm.mysql.bigIntUnsigned(), y : tm.mysql.varChar(255), z : tm.mysql.boolean() }).setPrimaryKey(columns => [columns.x])
const myOtherTable58 = tsql.table("myOtherTable58").addColumns({ x : tm.mysql.bigIntUnsigned(), y : tm.mysql.varChar(255), z : tm.mysql.boolean() }).setPrimaryKey(columns => [columns.x])
const myOtherTable59 = tsql.table("myOtherTable59").addColumns({ x : tm.mysql.bigIntUnsigned(), y : tm.mysql.varChar(255), z : tm.mysql.boolean() }).setPrimaryKey(columns => [columns.x])
const myOtherTable60 = tsql.table("myOtherTable60").addColumns({ x : tm.mysql.bigIntUnsigned(), y : tm.mysql.varChar(255), z : tm.mysql.boolean() }).setPrimaryKey(columns => [columns.x])

export const query = tsql.QueryUtil.newInstance()
    .from(myTable)
    .innerJoinUsingPrimaryKey(tables => tables.myTable, myOtherTable1)
    .innerJoinUsingPrimaryKey(tables => tables.myOtherTable1, myOtherTable2)
    .innerJoinUsingPrimaryKey(tables => tables.myOtherTable2, myOtherTable3)
    .innerJoinUsingPrimaryKey(tables => tables.myOtherTable3, myOtherTable4)
    .innerJoinUsingPrimaryKey(tables => tables.myOtherTable4, myOtherTable5)
    .innerJoinUsingPrimaryKey(tables => tables.myOtherTable5, myOtherTable6)
    .innerJoinUsingPrimaryKey(tables => tables.myOtherTable6, myOtherTable7)
    .innerJoinUsingPrimaryKey(tables => tables.myOtherTable7, myOtherTable8)
    .innerJoinUsingPrimaryKey(tables => tables.myOtherTable8, myOtherTable9)
    .innerJoinUsingPrimaryKey(tables => tables.myOtherTable9, myOtherTable10)
    .innerJoinUsingPrimaryKey(tables => tables.myOtherTable10, myOtherTable11)
    .innerJoinUsingPrimaryKey(tables => tables.myOtherTable11, myOtherTable12)
    .innerJoinUsingPrimaryKey(tables => tables.myOtherTable12, myOtherTable13)
    .innerJoinUsingPrimaryKey(tables => tables.myOtherTable13, myOtherTable14)
    .innerJoinUsingPrimaryKey(tables => tables.myOtherTable14, myOtherTable15)
    .innerJoinUsingPrimaryKey(tables => tables.myOtherTable15, myOtherTable16)
    .innerJoinUsingPrimaryKey(tables => tables.myOtherTable16, myOtherTable17)
    .innerJoinUsingPrimaryKey(tables => tables.myOtherTable17, myOtherTable18)
    .innerJoinUsingPrimaryKey(tables => tables.myOtherTable18, myOtherTable19)
    .innerJoinUsingPrimaryKey(tables => tables.myOtherTable19, myOtherTable20)
    .innerJoinUsingPrimaryKey(tables => tables.myOtherTable20, myOtherTable21)
    .innerJoinUsingPrimaryKey(tables => tables.myOtherTable21, myOtherTable22)
    .innerJoinUsingPrimaryKey(tables => tables.myOtherTable22, myOtherTable23)
    .innerJoinUsingPrimaryKey(tables => tables.myOtherTable23, myOtherTable24)
    .innerJoinUsingPrimaryKey(tables => tables.myOtherTable24, myOtherTable25)
    .innerJoinUsingPrimaryKey(tables => tables.myOtherTable25, myOtherTable26)
    .innerJoinUsingPrimaryKey(tables => tables.myOtherTable26, myOtherTable27)
    .innerJoinUsingPrimaryKey(tables => tables.myOtherTable27, myOtherTable28)
    .innerJoinUsingPrimaryKey(tables => tables.myOtherTable28, myOtherTable29)
    .innerJoinUsingPrimaryKey(tables => tables.myOtherTable29, myOtherTable30)
    .innerJoinUsingPrimaryKey(tables => tables.myOtherTable30, myOtherTable31)
    .innerJoinUsingPrimaryKey(tables => tables.myOtherTable31, myOtherTable32)
    .innerJoinUsingPrimaryKey(tables => tables.myOtherTable32, myOtherTable33)
    .innerJoinUsingPrimaryKey(tables => tables.myOtherTable33, myOtherTable34)
    .innerJoinUsingPrimaryKey(tables => tables.myOtherTable34, myOtherTable35)
    .innerJoinUsingPrimaryKey(tables => tables.myOtherTable35, myOtherTable36)
    .innerJoinUsingPrimaryKey(tables => tables.myOtherTable36, myOtherTable37)
    .innerJoinUsingPrimaryKey(tables => tables.myOtherTable37, myOtherTable38)
    .innerJoinUsingPrimaryKey(tables => tables.myOtherTable38, myOtherTable39)
    .innerJoinUsingPrimaryKey(tables => tables.myOtherTable39, myOtherTable40)
    .innerJoinUsingPrimaryKey(tables => tables.myOtherTable40, myOtherTable41)
    .innerJoinUsingPrimaryKey(tables => tables.myOtherTable41, myOtherTable42)
    .innerJoinUsingPrimaryKey(tables => tables.myOtherTable42, myOtherTable43)
    .innerJoinUsingPrimaryKey(tables => tables.myOtherTable43, myOtherTable44)
    .innerJoinUsingPrimaryKey(tables => tables.myOtherTable44, myOtherTable45)
    .innerJoinUsingPrimaryKey(tables => tables.myOtherTable45, myOtherTable46)
    .innerJoinUsingPrimaryKey(tables => tables.myOtherTable46, myOtherTable47)
    .innerJoinUsingPrimaryKey(tables => tables.myOtherTable47, myOtherTable48)
    .innerJoinUsingPrimaryKey(tables => tables.myOtherTable48, myOtherTable49)
    .innerJoinUsingPrimaryKey(tables => tables.myOtherTable49, myOtherTable50)
    .innerJoinUsingPrimaryKey(tables => tables.myOtherTable50, myOtherTable51)
    .innerJoinUsingPrimaryKey(tables => tables.myOtherTable51, myOtherTable52)
    .innerJoinUsingPrimaryKey(tables => tables.myOtherTable52, myOtherTable53)
    .innerJoinUsingPrimaryKey(tables => tables.myOtherTable53, myOtherTable54)
    .innerJoinUsingPrimaryKey(tables => tables.myOtherTable54, myOtherTable55)
    .innerJoinUsingPrimaryKey(tables => tables.myOtherTable55, myOtherTable56)
    .innerJoinUsingPrimaryKey(tables => tables.myOtherTable56, myOtherTable57)
    .innerJoinUsingPrimaryKey(tables => tables.myOtherTable57, myOtherTable58)
    .innerJoinUsingPrimaryKey(tables => tables.myOtherTable58, myOtherTable59)
    .innerJoinUsingPrimaryKey(tables => tables.myOtherTable59, myOtherTable60);

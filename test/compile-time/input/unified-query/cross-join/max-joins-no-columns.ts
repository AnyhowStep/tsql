import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../dist";

const myTable = tsql.table("myTable")
    .addColumns({
        myTableId : tm.mysql.bigIntUnsigned(),
    });

const myOtherTable1 = tsql.table("myOtherTable1");
const myOtherTable2 = tsql.table("myOtherTable2");
const myOtherTable3 = tsql.table("myOtherTable3");
const myOtherTable4 = tsql.table("myOtherTable4");
const myOtherTable5 = tsql.table("myOtherTable5");
const myOtherTable6 = tsql.table("myOtherTable6");
const myOtherTable7 = tsql.table("myOtherTable7");
const myOtherTable8 = tsql.table("myOtherTable8");
const myOtherTable9 = tsql.table("myOtherTable9");
const myOtherTable10 = tsql.table("myOtherTable10");

const myOtherTable11 = tsql.table("myOtherTable11");
const myOtherTable12 = tsql.table("myOtherTable12");
const myOtherTable13 = tsql.table("myOtherTable13");
const myOtherTable14 = tsql.table("myOtherTable14");
const myOtherTable15 = tsql.table("myOtherTable15");
const myOtherTable16 = tsql.table("myOtherTable16");
const myOtherTable17 = tsql.table("myOtherTable17");
const myOtherTable18 = tsql.table("myOtherTable18");
const myOtherTable19 = tsql.table("myOtherTable19");
const myOtherTable20 = tsql.table("myOtherTable20");

const myOtherTable21 = tsql.table("myOtherTable21");
const myOtherTable22 = tsql.table("myOtherTable22");
const myOtherTable23 = tsql.table("myOtherTable23");
const myOtherTable24 = tsql.table("myOtherTable24");
const myOtherTable25 = tsql.table("myOtherTable25");
const myOtherTable26 = tsql.table("myOtherTable26");
const myOtherTable27 = tsql.table("myOtherTable27");
const myOtherTable28 = tsql.table("myOtherTable28");
const myOtherTable29 = tsql.table("myOtherTable29");
const myOtherTable30 = tsql.table("myOtherTable30");

const myOtherTable31 = tsql.table("myOtherTable31");
const myOtherTable32 = tsql.table("myOtherTable32");
const myOtherTable33 = tsql.table("myOtherTable33");
const myOtherTable34 = tsql.table("myOtherTable34");
const myOtherTable35 = tsql.table("myOtherTable35");
const myOtherTable36 = tsql.table("myOtherTable36");
const myOtherTable37 = tsql.table("myOtherTable37");
const myOtherTable38 = tsql.table("myOtherTable38");
const myOtherTable39 = tsql.table("myOtherTable39");
const myOtherTable40 = tsql.table("myOtherTable40");

const myOtherTable41 = tsql.table("myOtherTable41");
const myOtherTable42 = tsql.table("myOtherTable42");
const myOtherTable43 = tsql.table("myOtherTable43");
const myOtherTable44 = tsql.table("myOtherTable44");
const myOtherTable45 = tsql.table("myOtherTable45");
const myOtherTable46 = tsql.table("myOtherTable46");
const myOtherTable47 = tsql.table("myOtherTable47");
const myOtherTable48 = tsql.table("myOtherTable48");
const myOtherTable49 = tsql.table("myOtherTable49");
const myOtherTable50 = tsql.table("myOtherTable50");

const myOtherTable51 = tsql.table("myOtherTable51");
const myOtherTable52 = tsql.table("myOtherTable52");
const myOtherTable53 = tsql.table("myOtherTable53");
const myOtherTable54 = tsql.table("myOtherTable54");
const myOtherTable55 = tsql.table("myOtherTable55");
const myOtherTable56 = tsql.table("myOtherTable56");
const myOtherTable57 = tsql.table("myOtherTable57");
const myOtherTable58 = tsql.table("myOtherTable58");
const myOtherTable59 = tsql.table("myOtherTable59");
const myOtherTable60 = tsql.table("myOtherTable60");

export const query = tsql.QueryUtil.newInstance()
    .from(myTable)
    .crossJoin(myOtherTable1)
    .crossJoin(myOtherTable2)
    .crossJoin(myOtherTable3)
    .crossJoin(myOtherTable4)
    .crossJoin(myOtherTable5)
    .crossJoin(myOtherTable6)
    .crossJoin(myOtherTable7)
    .crossJoin(myOtherTable8)
    .crossJoin(myOtherTable9)
    .crossJoin(myOtherTable10)
    .crossJoin(myOtherTable11)
    .crossJoin(myOtherTable12)
    .crossJoin(myOtherTable13)
    .crossJoin(myOtherTable14)
    .crossJoin(myOtherTable15)
    .crossJoin(myOtherTable16)
    .crossJoin(myOtherTable17)
    .crossJoin(myOtherTable18)
    .crossJoin(myOtherTable19)
    .crossJoin(myOtherTable20)
    .crossJoin(myOtherTable21)
    .crossJoin(myOtherTable22)
    .crossJoin(myOtherTable23)
    .crossJoin(myOtherTable24)
    .crossJoin(myOtherTable25)
    .crossJoin(myOtherTable26)
    .crossJoin(myOtherTable27)
    .crossJoin(myOtherTable28)
    .crossJoin(myOtherTable29)
    .crossJoin(myOtherTable30)
    .crossJoin(myOtherTable31)
    .crossJoin(myOtherTable32)
    .crossJoin(myOtherTable33)
    .crossJoin(myOtherTable34)
    .crossJoin(myOtherTable35)
    .crossJoin(myOtherTable36)
    .crossJoin(myOtherTable37)
    .crossJoin(myOtherTable38)
    .crossJoin(myOtherTable39)
    .crossJoin(myOtherTable40)
    .crossJoin(myOtherTable41)
    .crossJoin(myOtherTable42)
    .crossJoin(myOtherTable43)
    .crossJoin(myOtherTable44)
    .crossJoin(myOtherTable45)
    .crossJoin(myOtherTable46)
    .crossJoin(myOtherTable47)
    .crossJoin(myOtherTable48)
    .crossJoin(myOtherTable49)
    .crossJoin(myOtherTable50)
    .crossJoin(myOtherTable51)
    .crossJoin(myOtherTable52)
    .crossJoin(myOtherTable53)
    .crossJoin(myOtherTable54)
    .crossJoin(myOtherTable55)
    .crossJoin(myOtherTable56)
    .crossJoin(myOtherTable57)
    .crossJoin(myOtherTable58)
    .crossJoin(myOtherTable59)
    .crossJoin(myOtherTable60);

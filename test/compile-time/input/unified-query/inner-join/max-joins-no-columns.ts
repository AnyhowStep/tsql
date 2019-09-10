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
    .innerJoin(myOtherTable1, () => true)
    .innerJoin(myOtherTable2, () => true)
    .innerJoin(myOtherTable3, () => true)
    .innerJoin(myOtherTable4, () => true)
    .innerJoin(myOtherTable5, () => true)
    .innerJoin(myOtherTable6, () => true)
    .innerJoin(myOtherTable7, () => true)
    .innerJoin(myOtherTable8, () => true)
    .innerJoin(myOtherTable9, () => true)
    .innerJoin(myOtherTable10, () => true)
    .innerJoin(myOtherTable11, () => true)
    .innerJoin(myOtherTable12, () => true)
    .innerJoin(myOtherTable13, () => true)
    .innerJoin(myOtherTable14, () => true)
    .innerJoin(myOtherTable15, () => true)
    .innerJoin(myOtherTable16, () => true)
    .innerJoin(myOtherTable17, () => true)
    .innerJoin(myOtherTable18, () => true)
    .innerJoin(myOtherTable19, () => true)
    .innerJoin(myOtherTable20, () => true)
    .innerJoin(myOtherTable21, () => true)
    .innerJoin(myOtherTable22, () => true)
    .innerJoin(myOtherTable23, () => true)
    .innerJoin(myOtherTable24, () => true)
    .innerJoin(myOtherTable25, () => true)
    .innerJoin(myOtherTable26, () => true)
    .innerJoin(myOtherTable27, () => true)
    .innerJoin(myOtherTable28, () => true)
    .innerJoin(myOtherTable29, () => true)
    .innerJoin(myOtherTable30, () => true)
    .innerJoin(myOtherTable31, () => true)
    .innerJoin(myOtherTable32, () => true)
    .innerJoin(myOtherTable33, () => true)
    .innerJoin(myOtherTable34, () => true)
    .innerJoin(myOtherTable35, () => true)
    .innerJoin(myOtherTable36, () => true)
    .innerJoin(myOtherTable37, () => true)
    .innerJoin(myOtherTable38, () => true)
    .innerJoin(myOtherTable39, () => true)
    .innerJoin(myOtherTable40, () => true)
    .innerJoin(myOtherTable41, () => true)
    .innerJoin(myOtherTable42, () => true)
    .innerJoin(myOtherTable43, () => true)
    .innerJoin(myOtherTable44, () => true)
    .innerJoin(myOtherTable45, () => true)
    .innerJoin(myOtherTable46, () => true)
    .innerJoin(myOtherTable47, () => true)
    .innerJoin(myOtherTable48, () => true)
    .innerJoin(myOtherTable49, () => true)
    .innerJoin(myOtherTable50, () => true)
    .innerJoin(myOtherTable51, () => true)
    .innerJoin(myOtherTable52, () => true)
    .innerJoin(myOtherTable53, () => true)
    .innerJoin(myOtherTable54, () => true)
    .innerJoin(myOtherTable55, () => true)
    .innerJoin(myOtherTable56, () => true)
    .innerJoin(myOtherTable57, () => true)
    .innerJoin(myOtherTable58, () => true)
    .innerJoin(myOtherTable59, () => true)
    .innerJoin(myOtherTable60, () => true);

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
    .leftJoin(myOtherTable1, () => true)
    .leftJoin(myOtherTable2, () => true)
    .leftJoin(myOtherTable3, () => true)
    .leftJoin(myOtherTable4, () => true)
    .leftJoin(myOtherTable5, () => true)
    .leftJoin(myOtherTable6, () => true)
    .leftJoin(myOtherTable7, () => true)
    .leftJoin(myOtherTable8, () => true)
    .leftJoin(myOtherTable9, () => true)
    .leftJoin(myOtherTable10, () => true)
    .leftJoin(myOtherTable11, () => true)
    .leftJoin(myOtherTable12, () => true)
    .leftJoin(myOtherTable13, () => true)
    .leftJoin(myOtherTable14, () => true)
    .leftJoin(myOtherTable15, () => true)
    .leftJoin(myOtherTable16, () => true)
    .leftJoin(myOtherTable17, () => true)
    .leftJoin(myOtherTable18, () => true)
    .leftJoin(myOtherTable19, () => true)
    .leftJoin(myOtherTable20, () => true)
    .leftJoin(myOtherTable21, () => true)
    .leftJoin(myOtherTable22, () => true)
    .leftJoin(myOtherTable23, () => true)
    .leftJoin(myOtherTable24, () => true)
    .leftJoin(myOtherTable25, () => true)
    .leftJoin(myOtherTable26, () => true)
    .leftJoin(myOtherTable27, () => true)
    .leftJoin(myOtherTable28, () => true)
    .leftJoin(myOtherTable29, () => true)
    .leftJoin(myOtherTable30, () => true)
    .leftJoin(myOtherTable31, () => true)
    .leftJoin(myOtherTable32, () => true)
    .leftJoin(myOtherTable33, () => true)
    .leftJoin(myOtherTable34, () => true)
    .leftJoin(myOtherTable35, () => true)
    .leftJoin(myOtherTable36, () => true)
    .leftJoin(myOtherTable37, () => true)
    .leftJoin(myOtherTable38, () => true)
    .leftJoin(myOtherTable39, () => true)
    .leftJoin(myOtherTable40, () => true)
    .leftJoin(myOtherTable41, () => true)
    .leftJoin(myOtherTable42, () => true)
    .leftJoin(myOtherTable43, () => true)
    .leftJoin(myOtherTable44, () => true)
    .leftJoin(myOtherTable45, () => true)
    .leftJoin(myOtherTable46, () => true)
    .leftJoin(myOtherTable47, () => true)
    .leftJoin(myOtherTable48, () => true)
    .leftJoin(myOtherTable49, () => true)
    .leftJoin(myOtherTable50, () => true)
    .leftJoin(myOtherTable51, () => true)
    .leftJoin(myOtherTable52, () => true)
    .leftJoin(myOtherTable53, () => true)
    .leftJoin(myOtherTable54, () => true)
    .leftJoin(myOtherTable55, () => true)
    .leftJoin(myOtherTable56, () => true)
    .leftJoin(myOtherTable57, () => true)
    .leftJoin(myOtherTable58, () => true)
    .leftJoin(myOtherTable59, () => true)
    .leftJoin(myOtherTable60, () => true);
